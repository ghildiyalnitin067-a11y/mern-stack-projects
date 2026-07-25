import React from 'react';
import { Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import './FoodCard.css';

const FoodCard = ({ food, onSelect, onReserve, isReserved }) => {
  const handleCardClick = (e) => {
    if (e.target.closest('.btn-card-reserve')) {
      return;
    }
    if (onSelect) {
      onSelect(food);
    }
  };

  const handleReserveClick = (e) => {
    e.stopPropagation();
    if (onReserve) {
      onReserve(food);
    }
  };

  return (
    <div className="food-card" onClick={handleCardClick}>
      {/* Top Image Box */}
      <div className="food-card-image-wrapper">
        <img 
          src={food.images && food.images[0] ? food.images[0] : '/images/pastries.png'} 
          alt={food.title} 
          className="food-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/pastries.png';
          }}
        />
        <div className="food-card-distance-badge">
          <MapPin size={12} className="distance-icon" />
          <span>{food.distance} miles</span>
        </div>
      </div>

      <div className="food-card-content">
        <h3 className="food-card-title">{food.title}</h3>

        <div className={`food-card-expiry ${food.isUrgent ? 'urgent' : ''}`}>
          <Clock size={14} className="expiry-icon" />
          <span>{food.expiresIn}</span>
        </div>

        {food.dietary && food.dietary.length > 0 && (
          <div className="food-card-tags">
            {food.dietary.map((tag, index) => (
              <span key={index} className="dietary-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="food-card-footer">
          <div className="donor-info">
            {food.donor?.avatar ? (
              <img src={food.donor.avatar} alt={food.donor.name} className="donor-avatar" />
            ) : (
              <div className="donor-avatar-placeholder">
                <User size={14} />
              </div>
            )}
            <span className="donor-name">{food.donor?.name || 'Anonymous Donor'}</span>
          </div>

          <button 
            className={`btn-card-reserve ${isReserved ? 'reserved' : ''}`}
            onClick={handleReserveClick}
            disabled={isReserved}
          >
            {isReserved ? (
              <>
                <CheckCircle2 size={15} />
                <span>Reserved</span>
              </>
            ) : (
              'Reserve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
