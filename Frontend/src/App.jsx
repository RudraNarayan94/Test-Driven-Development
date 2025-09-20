/**
 * Main App Component
 * Root component that handles routing between auth and dashboard
 */

import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SweetProvider } from "./contexts/SweetContext";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Dashboard from "./components/dashboard/Dashboard";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Main App Router Component
const AppRouter = () => {
  const { isLoggedIn, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner
          size="lg"
          text="Loading Sweet Shop..."
          className="min-h-screen"
        />
      </div>
    );
  }

  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
};

// Root App Component with Providers
function App() {
  return (
    <AuthProvider>
      <SweetProvider>
        <AppRouter />
      </SweetProvider>
    </AuthProvider>
  );
}

export default App;
