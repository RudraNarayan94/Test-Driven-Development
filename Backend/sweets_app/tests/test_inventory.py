from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from sweets_app.models import Sweet, CustomUser
import json

class InventoryAPITestCase(APITestCase):
    def setUp(self):
        self.list_create_url = reverse('sweet-list-create')
        self.search_url = reverse('sweet-search')
        self.regular_user = CustomUser.objects.create_user(username='regularuser', password='password123')
        self.admin_user = CustomUser.objects.create_superuser(username='admin', password='password123')
        
        self.sweet1 = Sweet.objects.create(name='Chocolate Bar', category='Chocolate', price='2.00', quantity_in_stock=50)
        self.sweet2 = Sweet.objects.create(name='Gummy Bear', category='Gummy', price='1.50', quantity_in_stock=100)
        self.sweet3 = Sweet.objects.create(name='Jelly Beans', category='Gummy', price='1.00', quantity_in_stock=120)


    def test_purchase_sweet_successfully(self):
        """Test a user can purchase a sweet, decreasing the quantity."""
        self.client.force_authenticate(user=self.regular_user)
        purchase_url = reverse('sweet-purchase', kwargs={'pk': self.sweet1.id})
        initial_quantity = self.sweet1.quantity_in_stock
        
        response = self.client.post(purchase_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sweet1.refresh_from_db()
        self.assertEqual(self.sweet1.quantity_in_stock, initial_quantity - 1)
        self.assertEqual(response.data['quantity_in_stock'], initial_quantity - 1)

    def test_purchase_sweet_with_zero_quantity_fails(self):
        """Test purchasing a sweet with zero quantity fails."""
        self.client.force_authenticate(user=self.regular_user)
        sweet_out_of_stock = Sweet.objects.create(name='Lollipop', category='Hard Candy', price='0.50', quantity_in_stock=0)
        purchase_url = reverse('sweet-purchase', kwargs={'pk': sweet_out_of_stock.id})
        
        response = self.client.post(purchase_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'This sweet is out of stock.')
        sweet_out_of_stock.refresh_from_db()
        self.assertEqual(sweet_out_of_stock.quantity_in_stock, 0)
        
    def test_unauthenticated_user_cannot_purchase_sweet(self):
        """Test unauthenticated user cannot purchase a sweet."""
        self.client.force_authenticate(user=None)
        purchase_url = reverse('sweet-purchase', kwargs={'pk': self.sweet1.id})
        
        response = self.client.post(purchase_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.sweet1.refresh_from_db()
        self.assertEqual(self.sweet1.quantity_in_stock, 50)

    def test_admin_can_restock_sweet(self):
        """Test an admin user can restock a sweet."""
        self.client.force_authenticate(user=self.admin_user)
        restock_url = reverse('sweet-restock', kwargs={'pk': self.sweet1.id})
        restock_data = {'quantity': 10}
        initial_quantity = self.sweet1.quantity_in_stock
        
        response = self.client.post(restock_url, data=restock_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sweet1.refresh_from_db()
        self.assertEqual(self.sweet1.quantity_in_stock, initial_quantity + 10)
        self.assertEqual(response.data['quantity_in_stock'], initial_quantity + 10)
    
    def test_non_admin_cannot_restock_sweet(self):
        """Test a regular user is denied from restocking a sweet."""
        self.client.force_authenticate(user=self.regular_user)
        restock_url = reverse('sweet-restock', kwargs={'pk': self.sweet1.id})
        restock_data = {'quantity': 10}
        initial_quantity = self.sweet1.quantity_in_stock
        
        response = self.client.post(restock_url, data=restock_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.sweet1.refresh_from_db()
        self.assertEqual(self.sweet1.quantity_in_stock, initial_quantity)

    def test_restock_with_invalid_quantity_fails(self):
        """Test restocking with a non-integer or negative quantity fails."""
        self.client.force_authenticate(user=self.admin_user)
        restock_url = reverse('sweet-restock', kwargs={'pk': self.sweet1.id})
        invalid_data = {'quantity': -5}
        
        response = self.client.post(restock_url, data=invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Quantity must be a positive integer.')