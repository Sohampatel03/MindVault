import React, { useState } from 'react';
import { UserPlus, Brain,LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

const RegisterForm = ({ onBack, onSwitchToLogin }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      setToast({ message: 'Account created successfully! Please sign in.', type: 'success' });
      setTimeout(() => onSwitchToLogin(), 2000);
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Join MindVault</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div>
          <Input
            icon={UserPlus}
            placeholder="Full name"
            value={formData.name}
            onChange={(value) => setFormData({...formData, name: value})}
            error={errors.name}
          />
          
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

          <Input
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(value) => setFormData({...formData, confirmPassword: value})}
            error={errors.confirmPassword}
          />

          <Button 
            onClick={handleSubmit}
            className="w-full mb-4"
            loading={loading}
          >
            Create Account
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;