import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-center p-2 rounded-md" style={{
        color: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>{error}</p>}
      <div>
        <label htmlFor="email" className="sr-only">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-all duration-300"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'var(--hover-background)',
            border: '1px solid var(--border-color)',
            placeholderColor: 'var(--text-secondary)'
          }}
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-all duration-300"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'var(--hover-background)',
            border: '1px solid var(--border-color)',
            placeholderColor: 'var(--text-secondary)'
          }}
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 font-semibold rounded-lg transition-all duration-300 shadow-lg"
        style={{
          color: '#1a1a1a',
          backgroundColor: 'var(--accent-gold)',
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'var(--accent-gold-darker)';
          e.target.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'var(--accent-gold)';
          e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.2)';
        }}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
