/**
 * Restock Form Component
 * Modal form for restocking sweets (Admin only)
 */

import { useState } from 'react';
import { useSweets } from '../../contexts/SweetContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const RestockForm = ({ sweet, onClose }) => {
  const { restockSweet } = useSweets();
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const restockQuantity = parseInt(quantity);
    if (isNaN(restockQuantity) || restockQuantity <= 0) {
      setError('Please enter a valid quantity greater than 0');
      setLoading(false);
      return;
    }

    const result = await restockSweet(sweet.id, restockQuantity);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to restock sweet');
    }
    setLoading(false);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Restock ${sweet.name}`}>
      {error && (
        <div className="mb-4">
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </div>
      )}
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Current Stock:
          </span>
          <span className="text-lg font-bold text-purple-600">
            {sweet.quantity}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Add more inventory to this sweet
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Add Quantity"
          type="number"
          required
          min="1"
          placeholder="Enter quantity to add"
          value={quantity}
          onChange={handleQuantityChange}
        />
        
        {quantity && !isNaN(parseInt(quantity)) && parseInt(quantity) > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-800">
              New total stock will be: <strong>{sweet.quantity + parseInt(quantity)}</strong>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Restocking...' : 'Restock'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RestockForm;
