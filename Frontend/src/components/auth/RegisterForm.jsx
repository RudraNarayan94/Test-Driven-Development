/**
 * Register Form Component
 * Handles user registration
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const result = await register(formData);
    
    if (!result.success) {
      // Flatten errors object into array
      const errorList = [];
      if (result.errors) {
        Object.keys(result.errors).forEach(key => {
          if (Array.isArray(result.errors[key])) {
            errorList.push(...result.errors[key]);
          } else {
            errorList.push(result.errors[key]);
          }
        });
      }
      setErrors(errorList);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            🍭 Sweet Shop
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account
          </p>
        </div>
        
        {/* Error Alert */}
        {errors.length > 0 && (
          <Alert type="error" title="Please fix the following errors:">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              required
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            
            <Input
              label="Confirm Password"
              name="password_confirm"
              type="password"
              required
              placeholder="Confirm your password"
              value={formData.password_confirm}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={onSwitchToLogin}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
