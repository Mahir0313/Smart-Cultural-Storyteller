import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { playChapter, BASE_URL } from '../services/api';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => 
    parseFloat(localStorage.getItem('defaultVolume')) || 0.8
  );
  const [voice, setVoice] = useState(() => 
    localStorage.getItem('defaultVoice') || 'male'
  );
  const [speed, setSpeed] = useState(() => 
    parseFloat(localStorage.getItem('defaultSpeed')) || 1.0
  );
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const soundRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Progress tracking functions
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      if (soundRef.current) {
        const current = soundRef.current.seek();
        const total = soundRef.current.duration();
        setCurrentTime(current);
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }, 100);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const seekTo = useCallback((percentage) => {
    if (soundRef.current) {
      const time = (percentage / 100) * soundRef.current.duration();
      soundRef.current.seek(time);
      setCurrentTime(time);
      setProgress(percentage);
    }
  }, []);

  // 🔹 MAIN FIX: generate + play audio from backend
  const playTrack = useCallback(async (track) => {
    try {
      if (soundRef.current) {
        soundRef.current.stop();
      }

      const data = await playChapter(track.title, voice);
      const audioUrl = `${BASE_URL}${data.url}`;

      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        volume: volume,
        rate: speed,
        onplay: () => {
          setIsPlaying(true);
          setCurrentTrack(track);
          startProgressTracking();
        },
        onpause: () => {
          setIsPlaying(false);
          stopProgressTracking();
        },
        onend: () => {
          setIsPlaying(false);
          stopProgressTracking();
          setProgress(0);
          setCurrentTime(0);
        },
        onload: () => {
          const duration = sound.duration();
          setDuration(duration);
        },
        onloaderror: (id, err) => console.error('Howler load error:', err),
        onplayerror: (id, err) => console.error('Howler play error:', err),
      });

      sound.play();
      soundRef.current = sound;

    } catch (err) {
      console.error("Audio play error:", err);
      alert("Failed to generate or play audio");
    }
  }, [voice, volume, speed]);

  const togglePlayPause = useCallback(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
      setCurrentTrack(null);
      setIsPlaying(false);
      stopProgressTracking();
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [stopProgressTracking]);

  const updateVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const updateSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    localStorage.setItem('defaultSpeed', newSpeed.toString());
    if (soundRef.current) {
      soundRef.current.rate(newSpeed);
    }
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    voice,
    speed,
    progress,
    duration,
    currentTime,
    playTrack,
    togglePlayPause,
    stop,
    setVolume,
    setVoice,
    updateVolume,
    updateSpeed,
    seekTo,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
