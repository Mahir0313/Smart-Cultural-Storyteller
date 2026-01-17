import React, { memo, useState } from 'react';
import { PlayCircle, StopCircle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './EpisodeListItem.css';

const EpisodeListItem = memo(({ title, index }) => {
  const { playTrack, stop, currentTrack, isPlaying, voice } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentlyPlaying = currentTrack?.title === title && isPlaying;

  const handlePlayClick = async () => {
    if (isCurrentlyPlaying) {
      // Stop the current episode
      stop();
    } else {
      setIsLoading(true);
      try {
        console.log(`Playing with ${voice} voice for: ${title}`);
        await playTrack({ title: title });
      } catch (error) {
        console.error("Failed to play episode:", error);
        alert("Could not play episode. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTitleClick = async () => {
    if (isCurrentlyPlaying) {
      // Stop the current episode if clicking the playing title
      stop();
    } else {
      setIsLoading(true);
      try {
        console.log(`Playing with ${voice} voice for: ${title}`);
        await playTrack({ title: title });
      } catch (error) {
        console.error("Failed to play episode:", error);
        alert("Could not play episode. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`episode-list-item ${isCurrentlyPlaying ? 'playing' : ''}`}>
      <h4 
        className={`episode-title ${isCurrentlyPlaying ? 'playing-title' : ''}`}
        onClick={handleTitleClick}
      >
        {title}
      </h4>
      <button 
        onClick={handlePlayClick} 
        className={`play-button ${isCurrentlyPlaying ? 'stop-button' : ''}`} 
        disabled={isLoading}
      >
        {isLoading ? (
          "..."
        ) : isCurrentlyPlaying ? (
          <StopCircle size={24} />
        ) : (
          <PlayCircle size={24} />
        )}
      </button>
    </div>
  );
});

export default EpisodeListItem;
