from django.urls import path, include
from .views import *

urlpatterns = [
    #auth
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/',    UserLoginView.as_view(), name='login'),
    #sweets
    path('sweets/', SweetListCreateView.as_view(), name='sweet-list-create'),
    path('sweets/search/', SweetSearchView.as_view(), name='sweet-search'),
    path('sweets/<int:pk>/', SweetDetailView.as_view(), name='sweet-detail'),
]