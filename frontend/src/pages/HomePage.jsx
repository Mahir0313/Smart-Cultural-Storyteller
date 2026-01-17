import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStories } from '../context/StoryContext';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';

const HomePage = () => {
  const { user } = useAuth();
  const { stories, loading, error } = useStories();
  const navigate = useNavigate();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading...</div></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><div className="text-white">Error: {error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Featured Series Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-20">
          <div className="max-w-7xl mx-auto space-y-12 px-4">
            {stories.map((series) => (
              <div 
                key={series.id} 
                className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
                onClick={() => navigate(`/category/${slugify(series.title)}`)}
              >
                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                  <div className="flex h-48">
                    {/* Image on left - 35% */}
                    <div className="w-1/3 h-full relative overflow-hidden">
                      <img 
                        src={series.image} 
                        alt={series.title} 
                        className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                      {/* Overlay gradient for premium look */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black opacity-20"></div>
                      {/* Subtle border */}
                      <div className="absolute inset-0 border-r border-gray-600 opacity-30"></div>
                    </div>
                    
                    {/* Content on right - 65% */}
                    <div className="w-2/3 h-full p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-2 leading-tight" style={{color: '#ffd700'}}>{series.title}</h2>
                        <h4 className="text-gray-400 text-sm mb-3">{series.description}</h4>
                        
                        {/* Tags */}
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="text-gray-500 text-sm">Spiritual Content</span>
                          <span className="text-gray-500 text-sm"> • </span>
                          <span className="text-gray-500 text-sm">{series.subcategories?.length || 0} Sections</span>
                        </div>
                        
                        {/* Custom Summary - 4 lines */}
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {series.title === "THE PURĀNIC DEITIES" 
                            ? "Explore the divine pantheon of Hindu mythology featuring Brahma the creator, Vishnu the preserver with his ten avatars, and the powerful Shiva. Discover the sacred feminine through Uma, Parvati, Durga, and Kali, along with their divine sons Ganesha and Kartikeya. These stories reveal cosmic order, dharma, and eternal spiritual truths."
                            : "Meet the celestial beings who bridge the divine and mortal realms. From the wise sages like Bhrigu and Vasishtha who shaped ancient wisdom, to the noble demigods of the Ramayana like Hanuman and Sugriva. Journey through the cosmic influences of the planets, the powerful Asuras, and sacred animals including Garuda, the divine eagle carrier of Vishnu."
                          }
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                          </svg>
                          <span className="text-sm">Like</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
