import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { X, User, Volume2, Moon, Sun, Bell, Shield, HelpCircle, Trash2 } from 'lucide-react';
import './Settings.css';

const Settings = ({ onClose }) => {
  const { user } = useAuth();
  const { volume, voice, setVoice, updateVolume } = usePlayer();
  
  // Load settings from localStorage with proper initialization
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('notifications') !== 'false'
  );
  const [autoPlay, setAutoPlay] = useState(() => 
    localStorage.getItem('autoPlay') === 'true'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Apply theme on component mount and when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === null) {
      // If no saved preference, default to dark mode
      localStorage.setItem('darkMode', 'true');
      document.body.classList.remove('light-mode');
    } else if (savedTheme === 'false') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', notifications.toString());
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('autoPlay', autoPlay.toString());
  }, [autoPlay]);

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(u => u.email !== user?.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Clear all user data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('notifications');
    localStorage.removeItem('autoPlay');
    
    // Redirect to auth
    window.location.href = '/auth';
  };

  const handleVoiceChange = (newVoice) => {
    setVoice(newVoice);
    localStorage.setItem('defaultVoice', newVoice);
  };

  const handleVolumeChange = (newVolume) => {
    updateVolume(newVolume);
    localStorage.setItem('defaultVolume', newVolume.toString());
  };

  const handleHelpCenter = () => {
    // In a real app, this would navigate to help center
    alert('Help Center: Find answers to common questions and tutorials');
  };

  const handleContactSupport = () => {
    // In a real app, this would open support form or email
    alert('Contact Support: Reach out to our support team at support@omstream.com');
  };

  const handleAbout = () => {
    alert('OmStream v1.0.0\nYour spiritual content companion\nDiscover enlightening content to elevate your journey');
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          {/* Profile Section */}
          <div className="settings-section">
            <div className="section-header">
              <User size={18} className="section-icon" />
              <h3>Profile</h3>
            </div>
            <div className="setting-item">
              <label>Name</label>
              <input type="text" value={user?.name || ''} disabled className="setting-input" />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled className="setting-input" />
            </div>
          </div>

          {/* Audio Settings */}
          <div className="settings-section">
            <div className="section-header">
              <Volume2 size={18} className="section-icon" />
              <h3>Audio Settings</h3>
            </div>
            <div className="setting-item">
              <label>Default Voice</label>
              <select value={voice} onChange={(e) => handleVoiceChange(e.target.value)} className="setting-select">
                <option value="male">Male Voice</option>
                <option value="female">Female Voice</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Default Volume</label>
              <div className="volume-control">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(volume * 100)}%</span>
              </div>
            </div>
            <div className="setting-item">
              <label>Auto-play Next Episode</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  id="autoplay-toggle"
                />
                <label htmlFor="autoplay-toggle" className="toggle-slider"></label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="settings-section">
            <div className="section-header">
              {darkMode ? <Moon size={18} className="section-icon" /> : <Sun size={18} className="section-icon" />}
              <h3>Appearance</h3>
            </div>
            <div className="setting-item">
              <label>Dark Mode</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  id="darkmode-toggle"
                />
                <label htmlFor="darkmode-toggle" className="toggle-slider"></label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <Bell size={18} className="section-icon" />
              <h3>Notifications</h3>
            </div>
            <div className="setting-item">
              <label>Push Notifications</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  id="notifications-toggle"
                />
                <label htmlFor="notifications-toggle" className="toggle-slider"></label>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="settings-section">
            <div className="section-header">
              <HelpCircle size={18} className="section-icon" />
              <h3>Support</h3>
            </div>
            <div className="setting-item">
              <button onClick={handleHelpCenter} className="support-button">Help Center</button>
            </div>
            <div className="setting-item">
              <button onClick={handleContactSupport} className="support-button">Contact Support</button>
            </div>
            <div className="setting-item">
              <button onClick={handleAbout} className="support-button">About OmStream</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-section danger-zone">
            <div className="section-header">
              <Shield size={18} className="section-icon" />
              <h3>Account</h3>
            </div>
            <div className="setting-item">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-button"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <h3>Delete Account?</h3>
              <p>This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="delete-confirm-actions">
                <button onClick={() => setShowDeleteConfirm(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="confirm-delete-button">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
