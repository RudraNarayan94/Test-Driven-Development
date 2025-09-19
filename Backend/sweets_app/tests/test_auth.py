from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import json
# Import your custom user model instead of the default Django one
from sweets_app.models import CustomUser

class UserRegistrationTestCase(APITestCase):
    """
    Test cases for user registration endpoint using TDD approach.
    These tests will initially fail (Red phase) until we implement the endpoint.
    """
    
    def setUp(self):
        """Set up test data"""
        self.register_url = reverse('register')
        self.valid_user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123'
        }
        self.invalid_user_data = {
            'username': 'testuser2',
            'email': 'invalid-email',
            'password': 'short',
            'password_confirm': 'different'
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
        # Get initial user count from the correct model
        initial_user_count = CustomUser.objects.count()
        
        # Send POST request to register endpoint
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Assert that a new user was created
        self.assertEqual(CustomUser.objects.count(), initial_user_count + 1)
        
        # Assert that the user exists with the correct username
        user_exists = CustomUser.objects.filter(username=self.valid_user_data['username']).exists()
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
        
        # Assert sensitive data is not returned in response
        self.assertNotIn('password', user_data)
        self.assertNotIn('is_superuser', user_data)
        
        # Assert that is_staff is present and False for a new user
        self.assertIn('is_staff', user_data)
        self.assertFalse(user_data['is_staff'])

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
        initial_user_count = CustomUser.objects.count()
        
        # Send POST request with invalid data
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.invalid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(CustomUser.objects.count(), initial_user_count)
        
        # Assert response contains error messages for each field
        response_data = response.json()
        self.assertIn('email', response_data)
        self.assertIn('password', response_data)
        self.assertNotIn('password_confirm', response_data) # This assertion is now correct

    def test_registration_fails_with_missing_data(self):
        """
        Test Case 3 (Failure): Registration fails with missing required fields
        """
        # Get initial user count
        initial_user_count = CustomUser.objects.count()
        
        # Send POST request with missing data
        incomplete_data = {
            'username': 'testuser3'
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(incomplete_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(CustomUser.objects.count(), initial_user_count)
        
        # Assert response contains error messages for missing fields
        response_data = response.json()
        self.assertIn('email', response_data)
        self.assertIn('password', response_data)
        self.assertIn('password_confirm', response_data)

    def test_registration_fails_with_unmatched_passwords(self):
        """
        Test Case 4 (Failure): Registration fails when passwords do not match.
        """
        # Get initial user count
        initial_user_count = CustomUser.objects.count()

        # Create data with mismatched passwords
        mismatched_data = {
            'username': 'unmatched_user',
            'email': 'unmatched@example.com',
            'password': 'password123',
            'password_confirm': 'password321'
        }

        response = self.client.post(
            self.register_url,
            data=json.dumps(mismatched_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(CustomUser.objects.count(), initial_user_count)
        response_data = response.json()
        self.assertIn('password_confirm', response_data)
        self.assertEqual(response_data['password_confirm'][0], 'Passwords do not match.')

    def test_registration_fails_with_existing_username(self):
        """
        Test Case 5 (Failure): Registration fails when username already exists
        """
        # Create a user first using the correct model
        CustomUser.objects.create_user(
            username=self.valid_user_data['username'],
            email='existing@example.com',
            password='existingpassword123'
        )
        
        # Get initial user count
        initial_user_count = CustomUser.objects.count()
        
        # Try to register with the same username
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        # Assert response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no new user was created
        self.assertEqual(CustomUser.objects.count(), initial_user_count)
        
        # Assert response contains error message about username
        response_data = response.json()
        self.assertIn('username', response_data)

class UserLoginTestCase(APITestCase):
    """
    Test cases for user login endpoint.
    """
    def setUp(self):
        """
        Set up a valid user to be used for login tests.
        """
        self.login_url = reverse('login')
        self.username = 'testuser'
        self.password = 'testpassword123'
        self.email = 'testuser@example.com'
        self.user = CustomUser.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password
        )

    def test_user_can_login_successfully(self):
        """
        Test Case 1 (Success): User can log in with valid credentials.
        """
        login_data = {
            'username': self.username,
            'password': self.password
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('access_token', response_data)
        self.assertIn('refresh_token', response_data)
        self.assertIn('user', response_data)
        self.assertEqual(response_data['user']['username'], self.username)
        self.assertEqual(response_data['user']['email'], self.email)
        
    def test_login_fails_with_invalid_password(self):
        """
        Test Case 2 (Failure): Login fails with an invalid password.
        """
        login_data = {
            'username': self.username,
            'password': 'wrongpassword'
        }

        response = self.client.post(
            self.login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = response.json()
        self.assertIn('message', response_data)
        self.assertEqual(response_data['message'], 'Invalid credentials')

    def test_login_fails_with_non_existent_user(self):
        """
        Test Case 3 (Failure): Login fails with a non-existent username.
        """
        login_data = {
            'username': 'nonexistentuser',
            'password': 'anypassword'
        }

        response = self.client.post(
            self.login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = response.json()
        self.assertIn('message', response_data)
        self.assertEqual(response_data['message'], 'Invalid credentials')
    
    def test_login_fails_with_missing_data(self):
        """
        Test Case 4 (Failure): Login fails with missing fields.
        """
        login_data = {
            'username': self.username
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('password', response_data)
        self.assertEqual(response_data['password'][0], 'This field is required.')
