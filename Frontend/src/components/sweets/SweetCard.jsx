/**
 * Sweet Card Component
 * Displays individual sweet with purchase and admin actions
 */

import { useState } from "react";
import { useSweets } from "../../contexts/SweetContext";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const SweetCard = ({ sweet, isAdmin, onEdit, onDelete, onRestock }) => {
  const { purchaseSweet } = useSweets();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handlePurchase = async () => {
    setLoading(true);
    setMessage("");

    const result = await purchaseSweet(sweet.id, purchaseQuantity);

    if (result.success) {
      setMessage(result.message || "Purchase successful!");
      setMessageType("success");
      setPurchaseQuantity(1);
    } else {
      setMessage(result.error || "Purchase failed");
      setMessageType("error");
    }

    setLoading(false);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPurchaseQuantity(Math.min(Math.max(1, value), sweet.quantity));
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {sweet.name}
          </h3>
          <span className="text-2xl font-bold text-purple-600 ml-2">
            ${sweet.price}
          </span>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            {sweet.category}
          </span>
        </div>

        {/* Stock Info */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Stock: {sweet.quantity}</span>
          {isOutOfStock && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mb-4">
            <Alert type={messageType} onClose={() => setMessage("")}>
              {message}
            </Alert>
          </div>
        )}

        {/* Purchase Section */}
        {!isOutOfStock && (
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={handleQuantityChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Purchase quantity"
            />
            <Button
              onClick={handlePurchase}
              loading={loading}
              disabled={isOutOfStock}
              className="flex-1"
              size="sm">
              {loading ? "Purchasing..." : "Purchase"}
            </Button>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Button
              variant="info"
              size="sm"
              onClick={() => onEdit(sweet)}
              className="flex-1">
              Edit
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onRestock(sweet)}
              className="flex-1">
              Restock
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(sweet.id)}
              className="flex-1">
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;
