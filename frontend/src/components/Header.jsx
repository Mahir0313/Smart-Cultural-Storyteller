import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import SettingsModal from './Settings';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSettingsClick = () => {
    setProfileDropdownOpen(false);
    setSettingsOpen(true);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/om_logo.svg" alt="OmStream Logo" className="logo" />
        <Link to="/" className="title">OmStream</Link>
      </div>
      
      <div className="header-center">
        <div className="welcome-message">
          <h1 className="welcome-title">
            Welcome, <span className="user-name">{user?.name || 'Guest'}</span>!
          </h1>
          <p className="welcome-subtitle">Discover spiritual content to enlighten your journey</p>
        </div>
      </div>
      
      <div className="header-right">
        <div className="profile-section">
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="profile-button"
            >
              <div className="profile-avatar">
                <User size={20} className="avatar-icon" />
              </div>
              <span className="profile-name">{user?.name || 'Guest'}</span>
              <ChevronDown size={18} className="dropdown-icon" />
            </button>
            
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-content">
                  <button className="dropdown-item" onClick={handleSettingsClick}>
                    <Settings size={18} className="item-icon" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    <LogOut size={18} className="item-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </header>
  );
};

export default Header;
