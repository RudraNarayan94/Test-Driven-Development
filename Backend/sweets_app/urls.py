from django.urls import path, include
from .views import UserRegistrationView

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
]