# Fix PostCSS/Tailwind Dependencies Issue

## Problem
You're getting this error:
```
[Error] Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'
```

## Solution Steps

### 1. Remove conflicting packages
```bash
npm uninstall @tailwindcss/postcss
```

### 2. Install the correct dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. Alternative: Clear and reinstall everything
If the above doesn't work, try:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
```

### 4. Verify the configuration files

The PostCSS config (`postcss.config.js`) should look like this:
```javascript
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss, autoprefixer],
};
```

The Tailwind config (`tailwind.config.js`) should look like this:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### 5. Start the development server
```bash
npm run dev
```

## If you still have issues

Try using the CommonJS format for PostCSS config instead:

Create `postcss.config.cjs`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

And delete the `postcss.config.js` file.

## Expected Result
After fixing, you should be able to run `npm run dev` without any PostCSS errors, and your Tailwind CSS styles should work properly in the application.
