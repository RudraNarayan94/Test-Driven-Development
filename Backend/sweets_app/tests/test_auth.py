from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
import json


class UserRegistrationTestCase(APITestCase):
    """
    Test cases for user registration endpoint using TDD approach.
    These tests will initially fail (Red phase) until we implement the endpoint.
    """
    
    def setUp(self):
        """Set up test data"""
        self.register_url = reverse('register')  # This will fail initially as the URL doesn't exist
        self.valid_user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123'
        }
        self.invalid_user_data = {
            'username': 'testuser2',
            'email': 'invalid-email',  # Invalid email format
            'password': 'short',  # Too short password
            'password_confirm': 'different'  # Passwords don't match
        }
    
    def test_user_can_register_successfully(self):
        """
        Test Case 1 (Success): User can register with valid data
        
        This test should:
        1. Send a POST request to /api/auth/register with valid user data
        2. Assert that the response status code is 201 Created
        3. Assert that a new user with the given username exists in the database
        4. Assert that the response contains expected data (user info, tokens, etc.)
        """
        # Get initial user count
        initial_user_count = User.objects.count()
        
        # Send POST request to register endpoint
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Assert that a new user was created
        self.assertEqual(User.objects.count(), initial_user_count + 1)
        
        # Assert that the user exists with the correct username
        user_exists = User.objects.filter(username=self.valid_user_data['username']).exists()
        self.assertTrue(user_exists)
        
        # Assert response contains expected fields
        response_data = response.json()
        self.assertIn('user', response_data)
        self.assertIn('access_token', response_data)
        self.assertIn('refresh_token', response_data)
        
        # Assert user data in response
        user_data = response_data['user']
        self.assertEqual(user_data['username'], self.valid_user_data['username'])
        self.assertEqual(user_data['email'], self.valid_user_data['email'])
        
        # Assert password is not returned in response
        self.assertNotIn('password', user_data)
    
    def test_registration_fails_with_invalid_data(self):
        """
        Test Case 2 (Failure): Registration fails with invalid data
        
        This test should:
        1. Send a POST request with missing or invalid data
        2. Assert that the response status code is 400 Bad Request
        3. Assert that no new user was created
        4. Assert that the response contains appropriate error messages
        """
        # Get initial user count
        initial_user_count = User.objects.count()
        
        # Send POST request with invalid data
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.invalid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(User.objects.count(), initial_user_count)
        
        # Assert response contains error messages
        response_data = response.json()
        self.assertIn('errors', response_data)
    
    def test_registration_fails_with_missing_data(self):
        """
        Test Case 3 (Failure): Registration fails with missing required fields
        """
        # Get initial user count
        initial_user_count = User.objects.count()
        
        # Send POST request with missing data
        incomplete_data = {
            'username': 'testuser3'
            # Missing email, password, password_confirm
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(incomplete_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(User.objects.count(), initial_user_count)
        
        # Assert response contains error messages for missing fields
        response_data = response.json()
        self.assertIn('errors', response_data)
    
    def test_registration_fails_with_existing_username(self):
        """
        Test Case 4 (Failure): Registration fails when username already exists
        """
        # Create a user first
        User.objects.create_user(
            username=self.valid_user_data['username'],
            email='existing@example.com',
            password='existingpassword123'
        )
        
        # Get initial user count
        initial_user_count = User.objects.count()
        
        # Try to register with the same username
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(User.objects.count(), initial_user_count)
        
        # Assert response contains error message about username
        response_data = response.json()
        self.assertIn('errors', response_data)
