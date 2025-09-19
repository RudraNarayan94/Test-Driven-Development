from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import UserRegistrationSerializer, UserSerializer, LoginSerializer, SweetSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated

from .models import Sweet
from .permissions import IsAdminUser
from django.shortcuts import get_object_or_404

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


class UserLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)

            return Response({
                'user': user_serializer.data,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class SweetListCreateView(generics.ListCreateAPIView):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [IsAuthenticated]

class SweetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    
    def get_permissions(self):
        if self.request.method == 'DELETE':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

class SweetSearchView(generics.ListAPIView):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'category', 'price'] 
    permission_classes = [IsAuthenticated]


class SweetPurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        sweet = get_object_or_404(Sweet, pk=pk)

        if sweet.quantity_in_stock > 0:
            sweet.quantity_in_stock -= 1
            sweet.save()
            serializer = SweetSerializer(sweet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'This sweet is out of stock.'}, status=status.HTTP_400_BAD_REQUEST)

class SweetRestockView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        sweet = get_object_or_404(Sweet, pk=pk)
        quantity = request.data.get('quantity')
        
        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response({'error': 'quantity must be a positive integer.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'error': 'quantity must be a valid integer.'}, status=status.HTTP_400_BAD_REQUEST)

        sweet.quantity_in_stock += quantity
        sweet.save()
        serializer = SweetSerializer(sweet)
        return Response(serializer.data, status=status.HTTP_200_OK)