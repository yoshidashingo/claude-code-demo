import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SimpleTasks</h1>
          <p className="mt-2 text-gray-600">世界一シンプルなタスク管理</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? 'ログイン' : '新規登録'}
          </h2>
          
          {isLogin ? (
            <LoginForm
              onSuccess={handleSuccess}
              onRegisterClick={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onLoginClick={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};