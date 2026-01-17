import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setSuccess(result.message);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
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
      {success && <p className="text-sm text-center p-2 rounded-md" style={{
        color: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>{success}</p>}
      <div>
        <label htmlFor="name" className="sr-only">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-all duration-300"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'var(--hover-background)',
            border: '1px solid var(--border-color)',
            placeholderColor: 'var(--text-secondary)'
          }}
          placeholder="Full Name"
        />
      </div>
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
        <label htmlFor="password" className="sr-only">Create Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
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
          placeholder="Create Password"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-all duration-300"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'var(--hover-background)',
            border: '1px solid var(--border-color)',
            placeholderColor: 'var(--text-secondary)'
          }}
          placeholder="Confirm Password"
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
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
