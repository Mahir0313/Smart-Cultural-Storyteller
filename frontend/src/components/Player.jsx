import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Volume2, User, Gauge } from 'lucide-react';
import './Player.css';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    updateVolume, 
    updateSpeed,
    voice, 
    setVoice,
    volume,
    speed,
    progress,
    duration,
    currentTime,
    seekTo
  } = usePlayer();

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    updateVolume(newVolume);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    console.log('Speed changed to:', newSpeed); // Debug log
    updateSpeed(newSpeed);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    seekTo(newProgress);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`player-container ${currentTrack ? 'visible' : ''}`}>
      {/* Debug: Remove this line after fixing */}
      <div style={{position: 'absolute', top: '-20px', left: '0', color: 'white', fontSize: '12px'}}>
        Current speed: {speed} (type: {typeof speed})
      </div>
      
      <div className="episode-details">
        {currentTrack ? (
          <div>
            <p className="track-title">{currentTrack.title}</p>
            <p className="track-voice">
              {voice === 'male' ? 'Male Voice' : 'Female Voice'}
            </p>
          </div>
        ) : (
          <p>Select an episode to play</p>
        )}
      </div>

      {/* Progress Bar Section */}
      <div className="progress-section">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="progress-slider"
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="player-controls">
        <button
          onClick={togglePlayPause}
          disabled={!currentTrack}
          className="play-pause-btn"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="voice-control">
          <User size={16} className="voice-icon" />
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="voice-selector"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="speed-control">
          <Gauge size={16} className="speed-icon" />
          <select
            value={speed.toString()}
            onChange={handleSpeedChange}
            className="speed-selector"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>

        <div className="volume-control">
          <Volume2 size={16} className="volume-icon" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;