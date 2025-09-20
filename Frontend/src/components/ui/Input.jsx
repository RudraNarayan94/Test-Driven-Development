/**
 * Input Component
 * Reusable input field with label and error handling
 */

import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  required = false,
  ...props 
}, ref) => {
  const inputClasses = `
    mt-1 appearance-none relative block w-full px-3 py-2 border 
    ${error ? 'border-red-300' : 'border-gray-300'} 
    placeholder-gray-500 text-gray-900 rounded-md 
    focus:outline-none focus:ring-purple-500 focus:border-purple-500 
    focus:z-10 sm:text-sm transition-colors duration-200
    ${className}
  `;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
