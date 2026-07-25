import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Heart, MapPin, Clock, 
  MessageSquare, ShoppingBag, Store, CheckCircle, 
  X, Info, AlertTriangle, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import MapView from '../../components/common/MapView/MapView';
import './FoodDetail.css';

const FoodDetail = ({ food, allFoodItems = [], onBack, onReserve, isReserved, onContactDonor, onReportListing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!food) {
    return (
      <div className="food-detail-page">
        <div className="food-detail-container">
          <button className="back-link-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Discover
          </button>
          <div className="error-state">
            <AlertTriangle size={36} />
            <h2>Item Not Found</h2>
            <p>The food listing you requested is unavailable or has expired.</p>
            <button className="btn-back-home" onClick={onBack}>Return to Discover</button>
          </div>
        </div>
      </div>
    );
  }

  // Filter other food items from the same donor
  const donorItems = allFoodItems.filter(
    item => item.donor?.name === food.donor?.name && item.id !== food.id
  );

  const images = food.images && food.images.length > 0 
    ? food.images 
    : ['/images/cupcakes.png'];

  const extraImagesCount = images.length > 3 ? images.length - 3 : 0;

  return (
    <div className="food-detail-page">
      <div className="food-detail-container">
        
        {/* Back Link */}
        <div className="back-bar">
          <button className="back-link-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to Discover</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="food-detail-grid">
          
          {/* Left Column: Gallery & Details */}
          <div className="food-detail-left">
            
            {/* Gallery Grid */}
            <div className="detail-gallery">
              <div className="gallery-main" onClick={() => { setSelectedImageIndex(0); setShowLightbox(true); }}>
                <img src={images[0]} alt={food.title} className="gallery-img-large" />
              </div>

              <div className="gallery-side">
                {images[1] && (
                  <div className="gallery-side-item" onClick={() => { setSelectedImageIndex(1); setShowLightbox(true); }}>
                    <img src={images[1]} alt={`${food.title} 2`} className="gallery-img-small" />
                  </div>
                )}

                {images[2] && (
                  <div className="gallery-side-item" onClick={() => { setSelectedImageIndex(2); setShowLightbox(true); }}>
                    <img src={images[2]} alt={`${food.title} 3`} className="gallery-img-small" />
                    {extraImagesCount > 0 && (
                      <div className="more-overlay">
                        <span>+{extraImagesCount} more</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="detail-card">
              <h2 className="detail-section-title">Description</h2>
              <p className="detail-description-text">{food.description}</p>
            </div>

            {/* Ingredients & Dietary Card */}
            <div className="detail-card">
              <h2 className="detail-section-title">Ingredients & Dietary</h2>
              
              <div className="detail-tags-row">
                {food.dietary && food.dietary.map((tag, idx) => (
                  <span key={idx} className="ingredient-tag">
                    <ShieldCheck size={13} />
                    {tag}
                  </span>
                ))}
              </div>

              {food.allergenNote && (
                <p className="allergen-note">{food.allergenNote}</p>
              )}
            </div>

            {/* Pickup Instructions Card */}
            <div className="detail-card">
              <h2 className="detail-section-title">Pickup Instructions</h2>
              
              <div className="pickup-info-box">
                <div className="pickup-box-icon">
                  <Store size={20} />
                </div>
                <div className="pickup-box-text">
                  <h4>{food.donor?.name || 'Donor Location'}</h4>
                  <p>{food.pickupInstructions || 'Please ask at front desk and present your LeftOver pickup code.'}</p>
                </div>
              </div>
            </div>

            {/* Location & Map Card */}
            <div className="detail-card">
              <h2 className="detail-section-title">Location & Turn-by-Turn Map</h2>
              
              {/* Interactive OpenStreetMap & Google Maps Component */}
              <MapView 
                address={food.address}
                lat={food.lat}
                lng={food.lng}
                donorName={food.donor?.name}
                title={food.title}
                pickupWindow={food.pickupWindow}
                distance={food.distance}
              />
            </div>

            {/* More from this donor Section */}
            {donorItems.length > 0 && (
              <div className="donor-more-section">
                <h2 className="donor-more-title">More from this donor</h2>
                <div className="donor-more-grid">
                  {donorItems.slice(0, 3).map(item => (
                    <div key={item.id} className="donor-item-mini-card" onClick={() => onBack()}>
                      <div className="mini-card-image-box">
                        <img src={item.images[0]} alt={item.title} />
                        <span className="mini-distance-badge">{item.distance}m</span>
                      </div>
                      <div className="mini-card-body">
                        <h4 className="mini-card-title">{item.title}</h4>
                        <p className="mini-card-desc">{item.description}</p>
                        <div className="mini-card-footer">
                          <span className="mini-tag">{item.category}</span>
                          <span className="mini-time"><Clock size={11} /> {item.expiresIn}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action Box */}
          <div className="food-detail-right">
            <div className="detail-sticky-card">
              
              <div className="sticky-header">
                <h1 className="sticky-title">{food.title}</h1>
                <div className="sticky-badges">
                  <span className="badge-category">{food.category}</span>
                  <span className="badge-status">{food.status || 'Available'}</span>
                </div>
              </div>

              {/* Donor Card Header */}
              <div className="sticky-donor-box">
                <img src={food.donor?.avatar} alt={food.donor?.name} className="sticky-donor-avatar" />
                <div className="sticky-donor-details">
                  <h4>{food.donor?.name}</h4>
                  <div className="sticky-donor-stats">
                    <Star size={14} className="star-icon" />
                    <span>{food.donor?.rating || 4.9}</span>
                    <span className="stats-dot">•</span>
                    <span>({food.donor?.totalDonations || 120} donations)</span>
                  </div>
                </div>
                <button 
                  className={`btn-fav-toggle ${isFavorite ? 'active' : ''}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label="Favorite donor"
                >
                  <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#64748b'} />
                </button>
              </div>

              {/* Pickup & Distance Card */}
              <div className="sticky-info-panel">
                <div className="info-row">
                  <Clock size={16} className="info-row-icon" />
                  <div>
                    <span className="info-row-label">Pickup Window</span>
                    <span className="info-row-value">{food.pickupWindow}</span>
                  </div>
                </div>
                
                <div className="info-row-divider"></div>

                <div className="info-row">
                  <MapPin size={16} className="info-row-icon" />
                  <div>
                    <span className="info-row-label">Distance</span>
                    <span className="info-row-value">{food.distance} miles away</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky-actions">
                <button 
                  className={`btn-reserve-now ${isReserved ? 'reserved' : ''}`}
                  onClick={() => onReserve(food)}
                  disabled={isReserved}
                >
                  {isReserved ? (
                    <>
                      <CheckCircle size={18} />
                      <span>Reserved</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Reserve Now</span>
                    </>
                  )}
                </button>

                <button className="btn-contact-donor" onClick={() => onContactDonor(food)}>
                  <MessageSquare size={18} />
                  <span>Contact Donor</span>
                </button>
              </div>

              <div className="sticky-notice">
                <Info size={14} className="notice-icon" />
                <span>Please ensure you can pick up within the specified window before reserving.</span>
              </div>

              <button className="btn-report-listing-link" onClick={() => onReportListing && onReportListing(food)}>
                <ShieldAlert size={14} />
                <span>Report Listing or Hygiene Issue</span>
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* Gallery Lightbox Modal */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setShowLightbox(false)}>
              <X size={24} />
            </button>
            <img src={images[selectedImageIndex]} alt="Full view" className="lightbox-image" />
            <div className="lightbox-thumbnails">
              {images.map((imgUrl, idx) => (
                <img 
                  key={idx} 
                  src={imgUrl} 
                  alt={`Thumb ${idx}`} 
                  className={`lightbox-thumb ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoodDetail;
