from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserRegistrationSerializer, UserSerializer

class UserRegistrationView(APIView):
    """
    API for registration
    """
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            
            return Response({
                'user': user_serializer.data,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)