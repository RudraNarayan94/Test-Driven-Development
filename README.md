# 🍭 Sweet Shop - Full Stack Web Application

A modern full-stack web application for managing a sweet shop inventory, built with Django REST Framework backend and React frontend using Test-Driven Development (TDD) methodology.

## 📋 Project Overview

Sweet Shop is a comprehensive inventory management system that allows users to:

- **Browse Sweet Inventory**: View available sweets with categories, prices, and stock levels
- **User Authentication**: Secure registration and login system with JWT tokens
- **Purchase Sweets**: Buy sweets with real-time stock updates
- **Admin Management**: Add, edit, delete, and restock sweets (admin users only)
- **Responsive Design**: Modern, mobile-first UI with Tailwind CSS

### 🏗️ Architecture

- **Backend**: Django REST Framework with JWT authentication
- **Frontend**: React 18 with Vite, Context API for state management
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Styling**: Tailwind CSS with custom components
- **Development**: Test-Driven Development (TDD) approach

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download Git](https://git-scm.com/)

### 📁 Project Structure

```
sweet-shop/
├── Backend/                 # Django REST API
│   ├── core/               # Django project settings
│   ├── sweets_app/         # Main application
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── Frontend/               # React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## 🔧 Backend Setup (Django)

### 1. Navigate to Backend Directory

```bash
cd Backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the Backend directory:

```bash
# Backend/.env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional - uses SQLite by default)
# DATABASE_URL=postgresql://user:password@localhost:5432/sweetshop

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Tests

```bash
python manage.py test
```

### 8. Start Development Server

```bash
python manage.py runserver
```

The Django API will be available at: `http://localhost:8000`

## ⚛️ Frontend Setup (React)

### 1. Navigate to Frontend Directory

```bash
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the Frontend directory:

```bash
# Frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_NODE_ENV=development
VITE_DEBUG=false
```

### 4. Start Development Server

```bash
npm run dev
```

The React application will be available at: `http://localhost:5173`

## 🎯 Running the Complete Application

### Option 1: Manual Setup

1. **Start Backend** (Terminal 1):

   ```bash
   cd Backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   python manage.py runserver
   ```

2. **Start Frontend** (Terminal 2):

   ```bash
   cd Frontend
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:5173`

### Option 2: Using Scripts (if available)

```bash
# Start both servers concurrently
npm run dev:full
```

## 🧪 Testing

### Backend Tests (Django)

```bash
cd Backend
python manage.py test sweets_app.tests.test_auth
python manage.py test sweets_app.tests
```

### Frontend Tests (React)

```bash
cd Frontend
npm run test
npm run test:coverage
```

## 📱 Application Features

### 🔐 Authentication System

- User registration with validation
- Secure login with JWT tokens
- Persistent sessions
- Role-based access control (Admin/User)

### 🍬 Sweet Management

- **Browse**: View all available sweets in a responsive grid
- **Search**: Find sweets by name, category, or price
- **Purchase**: Buy sweets with quantity selection
- **Stock Tracking**: Real-time inventory updates

### 👨‍💼 Admin Features

- **Add Sweets**: Create new sweet entries
- **Edit Sweets**: Update existing sweet information
- **Delete Sweets**: Remove sweets from inventory
- **Restock**: Add inventory to existing sweets
- **Admin Badge**: Visual indicator for admin users

### 🎨 User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Loading States**: Visual feedback for all actions
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🛠️ Built With

### Backend Technologies

- **Django 5.2** - Web framework
- **Django REST Framework** - API framework
- **Django Simple JWT** - JWT authentication
- **Django CORS Headers** - Cross-origin resource sharing
- **SQLite** - Database (development)

### Frontend Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **Fetch API** - HTTP client

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **VS Code** - Recommended IDE

## 📸 Screenshots

![screen-shot 1](screenshots/image.png)
![screen-shot 2](screenshots/image-1.png)
![screen-shot 3](screenshots/image-2.png)
![screen-shot 4](screenshots/image-3.png)

## 🤖 My AI Usage

This project was developed with significant assistance from AI tools, specifically **Gemini** and **Augment Agent** (Claude Sonnet 4). Here's how AI was utilized throughout the development process:

### **Backend Development (Django)**

- **Project Planning & TDD:** I used Gemini to get a step-by-step plan for the backend development, which helped me organize the process according to the **Test-Driven Development (TDD)** methodology. This included breaking down each feature (user auth, sweets, inventory) into a Red-Green-Refactor cycle.
- **Code Generation & Refactoring:** I used Gemini to generate boilerplate code for the Django models, serializers, and views. It helped me refactor my login and registration views to follow best practices for security and efficiency.
- **Debugging & Problem Solving:** When I encountered a `ValueError` during a database migration and a `TypeError` during my test run, I provided the traceback to Gemini, which helped me quickly diagnose the issues and implement the correct fixes, saving significant development time.
- **Test Case Generation:** Gemini assisted me in writing the initial "Red" test cases for all API endpoints, including comprehensive tests for success, failure, and edge cases. This ensured my TDD process was robust from the start.

### **Frontend Development (React)**

- **Architectural Planning:** Augment Agent helped me design the frontend architecture as a single-page, single-file application. This plan included a clear component structure and a state management strategy using React's Context API.
- **Component & Hook Generation:** I used Augment Agent to write the individual React components (`SweetDashboard`, `SweetCard`, `SweetForm`, etc.) and the custom hooks (`useAuth`, `useSweets`) that manage the application's state and logic. This allowed me to focus on the overall application flow and user experience.
- **UI/UX Design:** Augment Agent assisted in applying modern and responsive design principles using Tailwind CSS classes, ensuring the application is visually appealing and functional on all devices.

### 🎓 Learning Outcomes

Working with AI enhanced the development process by:

- **Accelerating development** while maintaining code quality
- **Learning best practices** through AI-generated examples
- **Improving problem-solving** with AI-assisted debugging
- **Creating comprehensive documentation** with AI help

The AI served as a knowledgeable pair programming partner, helping to implement modern web development practices while ensuring the code remained maintainable and scalable.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Augment Agent** for AI-assisted development
- **Django REST Framework** for the excellent API framework
- **React Team** for the amazing frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool

---

**Happy Sweet Shopping! 🍭**
