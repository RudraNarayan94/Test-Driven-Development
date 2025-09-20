/**
 * Dashboard Component
 * Main application dashboard for authenticated users
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSweets } from '../../contexts/SweetContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import SweetCard from '../sweets/SweetCard';
import AddSweetForm from '../sweets/AddSweetForm';
import EditSweetForm from '../sweets/EditSweetForm';
import RestockForm from '../sweets/RestockForm';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { sweets, loading, error, fetchSweets, deleteSweet, clearError } = useSweets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      // searchSweets(searchQuery);
      console.log('Search functionality to be implemented:', searchQuery);
    } else {
      fetchSweets();
    }
  };

  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setShowEditForm(true);
  };

  const handleRestock = (sweet) => {
    setSelectedSweet(sweet);
    setShowRestockForm(true);
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) {
      const result = await deleteSweet(sweetId);
      if (!result.success) {
        // Error handling is managed by the context
        console.error('Failed to delete sweet');
      }
    }
  };

  const closeModals = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowRestockForm(false);
    setSelectedSweet(null);
  };

  if (loading && sweets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          text="Loading your sweet shop..." 
          className="min-h-screen"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🍭 Sweet Shop
              </h1>
              {isAdmin() && (
                <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.username}</span>!
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Search"
              >
                🔍
              </button>
            </div>
          </form>

          {isAdmin() && (
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="sm:ml-4"
            >
              Add New Sweet
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert 
              type="error" 
              title="Error"
              onClose={clearError}
            >
              {error}
            </Alert>
          </div>
        )}

        {/* Sweets Grid */}
        {sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍭</div>
            <p className="text-gray-500 text-lg mb-4">
              No sweets available
            </p>
            {isAdmin() && (
              <Button
                onClick={() => setShowAddForm(true)}
                size="lg"
              >
                Add the first sweet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                isAdmin={isAdmin()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddForm && (
        <AddSweetForm onClose={closeModals} />
      )}
      {showEditForm && selectedSweet && (
        <EditSweetForm sweet={selectedSweet} onClose={closeModals} />
      )}
      {showRestockForm && selectedSweet && (
        <RestockForm sweet={selectedSweet} onClose={closeModals} />
      )}
    </div>
  );
};

export default Dashboard;
