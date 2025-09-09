import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuthStore } from '../../stores/authStore';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    
    if (password.length < 6) {
      setValidationError('パスワードは6文字以上で入力してください');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('パスワードが一致しません');
      return;
    }
    
    try {
      await register(email, password);
      onSuccess?.();
    } catch {
      // エラーはストアで処理される
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="example@email.com"
      />
      
      <Input
        type="password"
        label="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="••••••••"
      />
      
      <Input
        type="password"
        label="パスワード（確認）"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="••••••••"
      />
      
      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error || validationError}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '処理中...' : '新規登録'}
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は
        <button
          type="button"
          onClick={onLoginClick}
          className="text-blue-600 hover:underline ml-1"
        >
          ログイン
        </button>
      </div>
    </form>
  );
};