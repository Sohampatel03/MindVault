import React, { useState } from 'react';
import { LogIn, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = ({ onBack, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your MindVault account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={LogIn}
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(value) => setFormData({...formData, email: value})}
            error={errors.email}
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(value) => setFormData({...formData, password: value})}
            error={errors.password}
          />

          <Button 
            type="submit"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToRegister}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;