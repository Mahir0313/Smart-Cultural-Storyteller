import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchStories } from '../services/api';

const StoryContext = createContext();

export const useStories = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStories();
        setStories(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const value = { stories, loading, error };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};
