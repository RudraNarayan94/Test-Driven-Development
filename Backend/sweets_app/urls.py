from django.urls import path, include
from .views import *

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/',    UserLoginView.as_view(), name='login'),
]