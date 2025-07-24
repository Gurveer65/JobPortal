from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_text = models.TextField(blank=True)

    def __str__(self):
        return f"Resume ({self.id})"

class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_online = models.BooleanField(default=False)
    

    def __str__(self):
        return self.title

class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    matched_score = models.FloatField(default=0.0)
    missing_keywords = models.TextField(blank=True)

    def __str__(self):
        return f"Application: Resume {self.resume.id} - Job {self.job.title}"

# def user_directory_path(instance, filename):
#     return f'profile_pics/user_{instance.user.id}/{filename}'

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
#     bio = models.TextField(blank=True, null=True)
#     zoom_level = models.IntegerField(default=1)  

#     def __str__(self):
#         return self.user.username

def user_directory_path(instance, filename):
    return f'profile_icons/user_{instance.user.id}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_icon = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    zoom_level = models.IntegerField(default=1)

    def __str__(self):
        return self.user.username
