from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from django.http import JsonResponse  # Add this if you want a default root view

# Optional: define a simple root_view for base URL
def root_view(request):
    return JsonResponse({"message": "Backend is running."})

urlpatterns = [
    path('', root_view),  # Optional base route
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # Make sure core/urls.py exists
    path('api/token/', obtain_auth_token),  # Token-based login
]

# If you're serving media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
