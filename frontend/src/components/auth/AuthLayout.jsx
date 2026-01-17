import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background)'}}>
      {/* Background with subtle gradient */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, var(--background) 0%, var(--card-background) 50%, var(--background) 100%)'}}></div>
      
      {/* Floating card container */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/om_logo.svg" alt="OmStream" className="h-12 w-12 mr-3" />
            <h1 className="text-3xl font-bold tracking-wider" style={{color: 'var(--accent-gold)'}}>OmStream</h1>
          </div>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Discover spiritual content to enlighten your journey</p>
        </div>
        
        {/* Main content card */}
        <div className="rounded-2xl shadow-2xl p-8" style={{
          backgroundColor: 'var(--modal-background)', 
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(20px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
