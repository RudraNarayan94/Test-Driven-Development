from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from sweets_app.models import Sweet, CustomUser
import json

class SweetAPITestCase(APITestCase):
    def setUp(self):
        self.list_create_url = reverse('sweet-list-create')
        self.search_url = reverse('sweet-search')
        self.regular_user = CustomUser.objects.create_user(username='regularuser', password='password123')
        self.admin_user = CustomUser.objects.create_superuser(username='admin', password='password123')
        
        self.sweet1 = Sweet.objects.create(name='Chocolate Bar', category='Chocolate', price='2.00', quantity_in_stock=50)
        self.sweet2 = Sweet.objects.create(name='Gummy Bear', category='Gummy', price='1.50', quantity_in_stock=100)
        self.sweet3 = Sweet.objects.create(name='Jelly Beans', category='Gummy', price='1.00', quantity_in_stock=120)

    def test_authenticated_user_can_create_sweet(self):
        """Test authenticated user can create a sweet."""
        self.client.force_authenticate(user=self.regular_user)
        new_sweet_data = {
            'name': 'Lollipop',
            'category': 'Hard Candy',
            'price': '0.50',
            'quantity_in_stock': 200
        }
        response = self.client.post(self.list_create_url, data=new_sweet_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sweet.objects.count(), 4)
        self.assertTrue(Sweet.objects.filter(name='Lollipop').exists())

    def test_unauthenticated_user_cannot_create_sweet(self):
        """Test unauthenticated user is denied from creating a sweet."""
        self.client.force_authenticate(user=None)
        new_sweet_data = {
            'name': 'Taffy',
            'category': 'Chewy',
            'price': '1.25',
            'quantity_in_stock': 50
        }
        response = self.client.post(self.list_create_url, data=new_sweet_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Sweet.objects.count(), 3)

    def test_authenticated_user_can_view_sweet_list(self):
        """Test authenticated user can view a list of sweets."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_unauthenticated_user_cannot_view_sweet_list(self):
        """Test unauthenticated user is denied from viewing the sweet list."""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_search_for_sweets_by_name(self):
        """Test searching for a sweet by its name."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.search_url + '?search=Chocolate')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Chocolate Bar')

    def test_search_for_sweets_by_category(self):
        """Test searching for sweets by category."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.search_url + '?search=Gummy')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_search_returns_no_results_for_invalid_query(self):
        """Test that search returns an empty list for a non-existent query."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.search_url + '?search=unknown')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_authenticated_user_can_update_sweet(self):
        """Test authenticated user can update a sweet."""
        self.client.force_authenticate(user=self.regular_user)
        
        updated_data = {
            'name': 'New Chocolate Bar',
            'category': self.sweet1.category,
            'price': str(self.sweet1.price),
            'quantity_in_stock': self.sweet1.quantity_in_stock
        }
        update_url = reverse('sweet-detail', kwargs={'pk': self.sweet1.id})
        response = self.client.put(update_url, data=updated_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sweet1.refresh_from_db()
        self.assertEqual(self.sweet1.name, 'New Chocolate Bar')

    def test_unauthenticated_user_cannot_update_sweet(self):
        """Test unauthenticated user cannot update a sweet."""
        self.client.force_authenticate(user=None)
        updated_data = {'name': 'New Chocolate Bar'}
        update_url = reverse('sweet-detail', kwargs={'pk': self.sweet1.id})
        response = self.client.put(update_url, data=updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_user_can_delete_sweet(self):
        """Test an admin user can delete a sweet."""
        self.client.force_authenticate(user=self.admin_user)
        delete_url = reverse('sweet-detail', kwargs={'pk': self.sweet1.id})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Sweet.objects.filter(pk=self.sweet1.id).exists())

    def test_regular_user_cannot_delete_sweet(self):
        """Test a regular user is denied from deleting a sweet."""
        self.client.force_authenticate(user=self.regular_user)
        delete_url = reverse('sweet-detail', kwargs={'pk': self.sweet1.id})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Sweet.objects.filter(pk=self.sweet1.id).exists())   