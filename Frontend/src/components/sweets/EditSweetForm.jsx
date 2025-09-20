/**
 * Edit Sweet Form Component
 * Modal form for editing existing sweets (Admin only)
 */

import { useState } from "react";
import { useSweets } from "../../contexts/SweetContext";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

const EditSweetForm = ({ sweet, onClose }) => {
  const { updateSweet } = useSweets();
  const [formData, setFormData] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price.toString(),
    quantity: sweet.quantity.toString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form data
    if (!formData.name.trim()) {
      setError("Sweet name is required");
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      setLoading(false);
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price greater than 0");
      setLoading(false);
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid quantity (0 or greater)");
      setLoading(false);
      return;
    }

    const result = await updateSweet(sweet.id, {
      ...formData,
      price,
      quantity,
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to update sweet");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Sweet">
      {error && (
        <div className="mb-4">
          <Alert type="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Sweet Name"
          name="name"
          required
          placeholder="Enter sweet name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Category"
          name="category"
          required
          placeholder="Enter sweet category (e.g., Chocolate, Candy, Gummy)"
          value={formData.category}
          onChange={handleChange}
        />

        <Input
          label="Price ($)"
          name="price"
          type="number"
          required
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          required
          min="0"
          placeholder="0"
          value={formData.quantity}
          onChange={handleChange}
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="info"
            loading={loading}
            className="flex-1">
            {loading ? "Updating..." : "Update Sweet"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSweetForm;
