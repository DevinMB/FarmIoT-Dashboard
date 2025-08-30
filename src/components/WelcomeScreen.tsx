import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sprout, Wifi, TrendingUp, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
}

interface WelcomeScreenProps {
  onLogin: (user: User) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    companyName: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication - in real app this would call your backend
    setTimeout(() => {
      if (loginForm.email === 'admin@farmiot.com') {
        onLogin({
          id: '1',
          email: loginForm.email,
          companyName: 'FarmIoT Admin',
          role: 'admin'
        });
      } else {
        onLogin({
          id: '2',
          email: loginForm.email,
          companyName: registerForm.companyName || 'Green Valley Farms',
          role: 'user'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Mock registration - in real app this would call your backend
    setTimeout(() => {
      onLogin({
        id: Date.now().toString(),
        email: registerForm.email,
        companyName: registerForm.companyName,
        role: 'user'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-90"></div>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1575704497240-17622d90265f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXJtJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTY1NzYwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern farm technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Sprout className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl text-white mb-6">
              Smart Farm IoT Platform
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Monitor your farm with custom Pi devices, LoRa sensors, and real-time analytics. 
              Download pre-configured images and manage your entire IoT ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Complete IoT Farm Management</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to monitor and manage your farm's IoT infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Custom Pi Images</h3>
              <p className="text-gray-600">
                Download pre-configured Raspberry Pi images tailored for your company's specific needs and environment.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3">ESP32 Node Management</h3>
              <p className="text-gray-600">
                Flash and configure ESP32 devices for LoRa communication with your farm's sensor network.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Real-time Metrics</h3>
              <p className="text-gray-600">
                View live data from your farm sensors through our Kafka-powered analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to access your farm's IoT dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      Demo: Use admin@farmiot.com for admin access
                    </p>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={registerForm.companyName}
                        onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                        placeholder="Your Farm Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;