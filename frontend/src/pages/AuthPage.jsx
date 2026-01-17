import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLayout from '../components/auth/AuthLayout';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <AuthLayout>
      {isLoginView ? <LoginForm /> : <RegisterForm />}
      <div className="text-center mt-6">
        <span className="text-sm text-gray-400">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
        </span>
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="ml-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {isLoginView ? 'Register' : 'Login'}
        </button>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;
