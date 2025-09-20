# Field Name Mapping: Backend ↔ Frontend

## Problem

The Django model uses `quantity_in_stock` as the field name, but the frontend components were using `quantity`. Additionally, the frontend components were initially set up to use `description` instead of `category`. These mismatches would cause API calls to fail or return incorrect data.

## Django Model

```python
class Sweet(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # ← Used directly in frontend
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity_in_stock = models.IntegerField(default=0)  # ← Backend field name
```

## Frontend Usage

```javascript
// Frontend components expect this structure:
const sweet = {
  id: 1,
  name: "Chocolate Bar",
  category: "Chocolate", // ← Direct mapping from backend
  price: 2.5,
  quantity: 10, // ← Frontend field name (transformed from quantity_in_stock)
};
```

## Solution: Data Transformation Layer

### 1. API Service Transformations

**Outgoing Data (Frontend → Backend)**

```javascript
// Transform quantity to quantity_in_stock before sending to backend
const backendData = {
  ...sweetData,
  quantity_in_stock: sweetData.quantity,
};
delete backendData.quantity;
// Note: category field is used directly (no transformation needed)
```

**Incoming Data (Backend → Frontend)**

```javascript
// Transform quantity_in_stock to quantity for frontend use
transformSweetFromBackend(sweet) {
  return {
    ...sweet,
    quantity: sweet.quantity_in_stock,
    // Note: category field is used directly (no transformation needed)
  };
}
```

### 2. Updated API Methods

All API methods now handle the transformation:

- ✅ `getSweets()` - Transforms response data
- ✅ `addSweet(sweetData)` - Transforms request and response
- ✅ `updateSweet(id, sweetData)` - Transforms request and response
- ✅ `deleteSweet(id)` - No transformation needed
- ✅ `purchaseSweet(id, quantity)` - Transforms response
- ✅ `restockSweet(id, quantity)` - Transforms response
- ✅ `searchSweets(query)` - Transforms response

### 3. Updated Context Methods

All SweetContext methods now handle the new response format:

- ✅ `fetchSweets()` - Handles response.success and response.data
- ✅ `addSweet()` - Handles response.success and response.data
- ✅ `updateSweet()` - Handles response.success and response.data
- ✅ `deleteSweet()` - Handles response.success and response.data
- ✅ `purchaseSweet()` - Handles response.success and response.data
- ✅ `restockSweet()` - Handles response.success and response.data
- ✅ `searchSweets()` - Handles response.success and response.data

## Benefits

1. **Consistency**: Frontend components can always use `quantity` regardless of backend field name
2. **Maintainability**: If backend field name changes, only the transformation layer needs updating
3. **Clarity**: Frontend uses more intuitive field names
4. **Backward Compatibility**: Existing frontend components don't need changes

## Updated Components

### 1. Form Components

**AddSweetForm.jsx & EditSweetForm.jsx**

- ✅ Changed from `description` field to `category` field
- ✅ Updated validation to check `category` instead of `description`
- ✅ Changed from `Textarea` to `Input` for category (more appropriate)
- ✅ Updated form data structure to use `quantity` (transformed by API layer)

```jsx
// Before (incorrect)
<Textarea
  label="Description"
  name="description"
  value={formData.description}
/>

// After (correct)
<Input
  label="Category"
  name="category"
  placeholder="Enter sweet category (e.g., Chocolate, Candy, Gummy)"
  value={formData.category}
/>
```

### 2. Display Components

**SweetCard.jsx**

- ✅ Changed from displaying description to displaying category as a badge
- ✅ Improved visual design with category badge styling

```jsx
// Before (incorrect)
<p className="text-gray-600 mb-4">
  {sweet.description}
</p>

// After (correct)
<div className="mb-4">
  <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
    {sweet.category}
  </span>
</div>
```

## Usage in Components

Components now use the correct field names:

```jsx
// SweetCard.jsx
<div className="text-sm text-gray-600">
  Stock: {sweet.quantity} {/* ← Transformed from quantity_in_stock */}
</div>

// AddSweetForm.jsx
<Input
  label="Category"
  name="category"  {/* ← Direct mapping to backend */}
  value={formData.category}
  onChange={handleChange}
/>
```

## Testing

To verify the transformation is working:

1. Check browser Network tab for API requests
2. Verify outgoing requests use `quantity_in_stock`
3. Verify incoming responses are transformed to use `quantity`
4. Test all CRUD operations (Create, Read, Update, Delete)
5. Test purchase and restock operations

## Error Handling

The transformation layer includes proper error handling:

- API errors are properly propagated
- Response format validation
- Fallback behavior for missing data

This ensures a seamless experience between the Django backend using `quantity_in_stock` and the React frontend using `quantity`.
