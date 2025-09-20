# 🚀 Sweet Shop Frontend Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL if different
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing (when implemented)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📝 Adding New Features

### 1. Adding a New UI Component

```bash
# Create component file
touch src/components/ui/NewComponent.jsx
```

```jsx
// src/components/ui/NewComponent.jsx
import React from 'react';

const NewComponent = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'base-styles';
  const variantClasses = {
    default: 'default-styles',
    primary: 'primary-styles'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default NewComponent;
```

### 2. Adding a New Page/Feature

```bash
# Create feature directory
mkdir src/components/feature-name
touch src/components/feature-name/FeatureComponent.jsx
```

### 3. Adding New API Endpoints

```javascript
// src/services/api.js
class ApiService {
  // Add new method
  async newEndpoint(data) {
    return this.request('/new-endpoint/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

### 4. Adding Context State

```jsx
// src/contexts/NewContext.jsx
import { createContext, useContext, useState } from 'react';

const NewContext = createContext();

export const NewProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const actions = {
    // Define actions here
  };

  return (
    <NewContext.Provider value={{ state, ...actions }}>
      {children}
    </NewContext.Provider>
  );
};

export const useNew = () => {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNew must be used within NewProvider');
  }
  return context;
};
```

## 🎨 Styling Guidelines

### Using Tailwind CSS

```jsx
// Good: Semantic class combinations
<button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
  Click me
</button>

// Better: Use the Button component
<Button variant="primary" size="md">
  Click me
</Button>
```

### Custom Styles

```css
/* src/index.css */
@layer components {
  .custom-component {
    @apply bg-white shadow-md rounded-lg p-4;
  }
}
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

## 🔧 State Management Patterns

### Local State (useState)
```jsx
const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({});
```

### Context State
```jsx
const { user, login, logout } = useAuth();
const { sweets, fetchSweets, addSweet } = useSweets();
```

### Form Handling
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Handle form submission
};
```

## 🐛 Debugging Tips

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Profile component performance

### Console Debugging
```javascript
// Debug API calls
console.log('API Request:', { endpoint, data });
console.log('API Response:', response);

// Debug state changes
console.log('State before:', prevState);
console.log('State after:', newState);
```

### Network Tab
- Monitor API requests/responses
- Check for CORS issues
- Verify JWT tokens are being sent

## 🚨 Common Issues & Solutions

### 1. CORS Errors
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Ensure Django backend has CORS configured:
```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative port
]
```

### 2. Authentication Issues
```
401 Unauthorized
```

**Solution**: Check JWT token storage and API headers:
```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('access_token'));

// Check API headers
console.log('Headers:', apiService.getAuthHeaders());
```

### 3. Component Not Re-rendering
**Solution**: Ensure state updates are immutable:
```javascript
// Wrong
state.items.push(newItem);
setState(state);

// Correct
setState({
  ...state,
  items: [...state.items, newItem]
});
```

### 4. Context Not Available
```
Error: useAuth must be used within an AuthProvider
```

**Solution**: Ensure component is wrapped in provider:
```jsx
<AuthProvider>
  <ComponentUsingAuth />
</AuthProvider>
```

## 📦 Building for Production

### Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_NODE_ENV=production
```

### Build Process
```bash
npm run build
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] CORS configured for production domain
- [ ] Error boundaries implemented
- [ ] Performance optimized
- [ ] Security headers configured

## 🧪 Testing Guidelines

### Component Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Context Testing
```jsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

test('login updates user state', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login({ username: 'test', password: 'test' });
  });

  expect(result.current.isLoggedIn).toBe(true);
});
```

## 🔄 Git Workflow

### Branch Naming
- `feature/add-sweet-search`
- `bugfix/fix-login-error`
- `hotfix/security-patch`

### Commit Messages
```
feat: add sweet search functionality
fix: resolve authentication token expiry
docs: update API documentation
style: improve button hover states
refactor: extract common form logic
test: add unit tests for SweetCard
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(if applicable)
```

This guide should help you develop efficiently while maintaining code quality and consistency!
