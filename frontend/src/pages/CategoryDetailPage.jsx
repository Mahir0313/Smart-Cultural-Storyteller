import React from 'react';
import { useParams } from 'react-router-dom';
import { useStories } from '../context/StoryContext';
import { slugify } from '../utils/slugify';
import EpisodeListItem from '../components/EpisodeListItem';
import './CategoryDetailPage.css';

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const { stories, loading, error } = useStories();

  if (loading) return <div>Loading series details...</div>;
  if (error) return <div>Error: {error}</div>;

  const category = stories.find(c => slugify(c.title) === categoryId);

  if (!category) return <div>Category not found.</div>;

  return (
    <div className="category-detail-page">
      <header className="category-header">
        <h1 className="category-title-detail">{category.title}</h1>
        <p className="category-description-detail">{category.description}</p>
      </header>
      <div className="subcategory-list">
        {category.subcategories.map(sub => (
          <div key={sub.title} className="subcategory-item">
            <h2 className="subcategory-title">{sub.title}</h2>
            <div className="episode-group">
              {sub.episodes && sub.episodes.map((episodeTitle, index) => (
                <EpisodeListItem key={episodeTitle} title={episodeTitle} index={index} />
              ))}
            </div>
            {sub.sub_series && (
              <div className="sub-series-group">
                <h3 className="sub-series-heading">Avatāras</h3>
                {sub.sub_series.map((seriesTitle, index) => (
                  <EpisodeListItem key={seriesTitle} title={seriesTitle} index={index} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
