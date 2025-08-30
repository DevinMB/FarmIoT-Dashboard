import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { Button } from './components/ui/button';
import { LogOut, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'admin'>('welcome');

  // Mock authentication state persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('welcome');
  };

  const handleViewChange = (view: 'dashboard' | 'admin') => {
    setCurrentView(view);
  };

  if (!currentUser) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl text-green-600">FarmIoT Platform</h1>
              <div className="flex space-x-4">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('dashboard')}
                >
                  Dashboard
                </Button>
                {currentUser.role === 'admin' && (
                  <Button
                    variant={currentView === 'admin' ? 'default' : 'ghost'}
                    onClick={() => handleViewChange('admin')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser.companyName} - {currentUser.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard user={currentUser} />}
        {currentView === 'admin' && currentUser.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;