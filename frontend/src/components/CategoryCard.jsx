import React from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const getAvatar = (title) => {
    if (title.includes("PURĀNIC")) {
      return "./public/images/puranic_deities.png";
    } else if (title.includes("INFERIOR")) {
      return "./public/images/inferior_deities.png";
    }
    return ""; // Default or placeholder image
  };

  const getCardClass = (title) => {
    if (title.includes("PURĀNIC") || title.includes("INFERIOR")) {
      return "category-card logo-color-card";
    }
    return "category-card";
  };
  const getTagline = (title) => {
    if (title.includes("PURĀNIC")) {
      return "The Divine Pantheon: Gods, Goddesses, and Cosmic Forces";
    } else if (title.includes("INFERIOR")) {
      return "Sages, Demigods, and Celestial Beings of the Ancient World";
    }
    return "Mythological Tales: Stories of Gods, Heroes, and Ancient Wisdom";
  };

  const getSummary = (title) => {
    if (title.includes("PURĀNIC")) {
      return "Journey through the epic sagas of Brahma, Vishnu, Shiva, and the great goddesses. Witness the cosmic dance of creation, preservation, and transformation that shapes the universe. Explore the divine avatars, their heroic deeds, and the profound philosophical teachings embedded in these timeless narratives.";
    } else if (title.includes("INFERIOR")) {
      return "Discover the wisdom of the ancient Rishis, the valor of demigods, and the mysteries of the celestial realms. Explore the stories of planets, Asuras, and sacred animals that play crucial roles in the cosmic order. Learn about the divine sages who shaped spiritual knowledge and the celestial beings who maintain cosmic balance.";
    }
    return "Uncover the timeless stories that form the bedrock of ancient wisdom and spiritual heritage. These narratives offer profound insights into the nature of existence, the path of righteousness, and the eternal struggle between order and chaos.";
  };

  return (
    <Link to={`/category/${slugify(category.title)}`} className="category-card-link">
      <div className={getCardClass(category.title)}>
        <img src={getAvatar(category.title)} alt={category.title} className="category-card-image" />
        <div className="category-card-content">
          <h2 className="category-card-title">{category.title}</h2>
          <p className="category-card-tagline">{getTagline(category.title)}</p>
          <p className="category-card-description">{category.description}</p>
          <p className="category-card-summary">{getSummary(category.title)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
