from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.generics import ListAPIView
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Resume, Job, JobApplication
from .serializers import ResumeSerializer, JobSerializer, JobApplicationSerializer, RegisterSerializer
from PyPDF2 import PdfReader
import docx2txt
import spacy
import requests
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Profile
from .serializers import ProfileSerializer

# NLP MODEL #
nlp = spacy.load("en_core_web_sm")

# ========== TEXT PROCESSING ========== #

def extract_text(file):
    if file.name.endswith(".pdf"):
        reader = PdfReader(file)
        return " ".join([page.extract_text() or '' for page in reader.pages])
    elif file.name.endswith(".docx"):
        return docx2txt.process(file)
    return ""

def extract_keywords(text):
    doc = nlp(text.lower())
    return set(token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "VERB", "ADJ"] and not token.is_stop and token.is_alpha)

def extract_skills(text):
    doc = nlp(text.lower())
    return [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "VERB", "ADJ"] and not token.is_stop and token.is_alpha]

# ========== AUTHENTICATION ========== #



class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    
# ========== RESUME UPLOAD ========== #

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            file = request.FILES['file']
            text = extract_text(file)
            skills = extract_skills(text)

            resume = Resume.objects.create(file=file, parsed_text=text, user=request.user)
            return Response({"message": "Resume Uploaded", "skills": skills})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# ========== MATCH ONE RESUME TO ONE JOB ========== #

class MatchResumeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        job_id = request.data.get('job_id')

        if not resume_id or not job_id:
            return Response({'error': 'Both resume_id and job_id are required.'}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
            job = Job.objects.get(id=job_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=404)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        resume_keywords = extract_keywords(resume.parsed_text)
        job_keywords = extract_keywords(job.description)

        matched = resume_keywords.intersection(job_keywords)
        missing = job_keywords - matched
        score = round(len(matched) / len(job_keywords) * 100, 2) if job_keywords else 0.0

        JobApplication.objects.create(
            resume=resume,
            job=job,
            matched_score=score,
            missing_keywords=", ".join(missing),
            user=request.user
        )

        return Response({
            "score": score,
            "matched_keywords": list(matched),
            "missing_keywords": list(missing),
            "message": "Resume matched successfully"
        })

# ========== MATCH ONE RESUME TO ALL JOBS ========== #

class ResumeJobMatchView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
            resume_skills = set(extract_skills(resume.parsed_text))
            jobs = Job.objects.filter(user=request.user)

            results = []
            for job in jobs:
                job_skill_text = job.skills_required or ""
                job_skills = set(s.strip().lower() for s in job_skill_text.split(",") if s.strip())
                matched = resume_skills & job_skills
                missing = job_skills - matched
                score = round(len(matched) / len(job_skills) * 100, 2) if job_skills else 0

                results.append({
                    "job id": job.id,
                    "job_title": job.title,
                    "match_score": score,
                    "matched_skills": list(matched),
                    "missing_skills": list(missing),
                    "skills_required": list(job_skills),
                })

            return Response({"results": results})
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

# ========== LIST LOGGED-IN USER'S RESUMES ========== #

class ResumeListView(ListAPIView):
    serializer_class = ResumeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)
    
def get_resume_by_id(request, pk):
    if request.method == 'GET':
        try:
            resume = Resume.objects.get(pk=pk)
            serializer = ResumeSerializer(resume)
            return JsonResponse(serializer.data, safe=False)
        except Resume.DoesNotExist:
            return JsonResponse({'error': 'Resume not found'}, status=404)

# ========== JOB LIST & CREATE ========== #

class JobListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(user=request.user).order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ========== ONLINE JOB MATCHING (ADZUNA) ========== #

class AdzunaJobListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        app_id = "a797b604"
        app_key = "2e455cfaeb300283d55496b38acf0ab7"
        country = "in"

        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": 10,
            "content-type": "application/json",
        }

        try:
            res = requests.get(url, params=params)
            data = res.json()
            jobs = []
            for job in data.get("results", []):
                jobs.append({
                    "title": job.get("title"),
                    "description": job.get("description"),
                    "company": job.get("company", {}).get("display_name"),
                    "location": job.get("location", {}).get("display_name"),
                    "redirect_url": job.get("redirect_url"),
                })

            return Response({"results": jobs})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class MatchResumeWithAdzunaView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get("resume_id")
        query = request.data.get("query", "developer")

        app_id = "a797b604"
        app_key = "4475ed217acd56a3e557fcf233286270"
        country = "in"

        if not resume_id:
            return Response({"error": "resume_id is required"}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

        resume_keywords = extract_keywords(resume.parsed_text)

        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": 10,
            "what": query
        }

        try:
            res = requests.get(url, params=params)
            data = res.json()
            results = []

            for job in data.get("results", []):
                job_text = job.get("description", "")
                job_keywords = extract_keywords(job_text)
                matched = resume_keywords & job_keywords
                missing = job_keywords - resume_keywords
                score = round(len(matched) / len(job_keywords) * 100, 2) if job_keywords else 0.0

                results.append({
                    "job_title": job.get("title"),
                    "company": job.get("company", {}).get("display_name"),
                    "score": score,
                    "matched_keywords": list(matched),
                    "missing_keywords": list(missing),
                    "apply_link": job.get("redirect_url"),
                })

            return Response({"results": results})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# myapp/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]  # Supports image uploads

    def get(self, request):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
class UploadProfilePictureView(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        profile.profile_picture = request.data.get('profile_picture')
        profile.save()
        return Response({"message": "Profile picture updated successfully."}, status=status.HTTP_200_OK)