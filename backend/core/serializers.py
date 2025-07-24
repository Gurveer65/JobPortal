from rest_framework import serializers
from .models import Resume, Job, JobApplication, Profile


class ResumeSerializer(serializers.ModelSerializer):
    resume_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ['id', 'user', 'file', 'uploaded_at', 'parsed_text', 'resume_name']

    def get_resume_name(self, obj):
        return obj.file.name.split('/')[-1]

class JobSerializer(serializers.ModelSerializer):
    skills_required = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Job
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'

from django.contrib.auth.models import User
from rest_framework import serializers

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)  

    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],  # no default fallback
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'username', 'email', 'bio', 'contact_info', 'profile_picture']
        read_only_fields = ['user', 'username', 'email']
