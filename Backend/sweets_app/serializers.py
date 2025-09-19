from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords do not match."
            })
        
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    """
    serializer for user data in responses
    """
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'date_joined', 'is_staff')
        read_only_fields = ('id', 'date_joined', 'is_staff')
