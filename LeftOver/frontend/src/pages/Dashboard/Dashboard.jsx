import React, { useState } from 'react';
import { 
  UtensilsCrossed, Leaf, Clock, HeartHandshake, 
  Plus, MapPin, CheckCircle2, ShieldCheck, 
  Award, Trash2, Heart, Store, User, ArrowRightLeft, AlertTriangle
} from 'lucide-react';
import DonorDashboard from '../../components/donor/DonorDashboard';
import './Dashboard.css';

const BADGES = [
  { id: 'b1', name: 'Zero Waste Pioneer', desc: 'Rescued your first 10 surplus meals', unlocked: true },
  { id: 'b2', name: 'Community Hero', desc: 'Donated surplus food to over 15 neighbors', unlocked: true },
  { id: 'b3', name: 'Carbon Saver', desc: 'Saved over 75kg of greenhouse gas emissions', unlocked: true },
  { id: 'b4', name: 'Bakery Lover', desc: 'Rescued 5+ pastry boxes before closing', unlocked: true },
  { id: 'b5', name: 'Century Club', desc: 'Rescued 100+ total meals from food waste', unlocked: false },
  { id: 'b6', name: 'Eco Legend', desc: 'Maintained a 30-day streak of food sharing', unlocked: false }
];

const SAVED_DONORS = [
  {
    id: 'sd-1',
    name: 'Sweet Tooth Bakery',
    category: 'Bakery & Desserts',
    rating: 4.9,
    donations: 120,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    distance: '0.8 miles away'
  },
  {
    id: 'sd-2',
    name: 'Sunny Bakery',
    category: 'Artisan Breads & Pastries',
    rating: 4.8,
    donations: 85,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    distance: '0.5 miles away'
  },
  {
    id: 'sd-3',
    name: 'Local Farm Fresh',
    category: 'Organic Produce',
    rating: 4.9,
    donations: 210,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    distance: '1.2 miles away'
  }
];

const Dashboard = ({ 
  foodItems = [], 
  reservedIds = [], 
  onSelectFood, 
  onOpenListFood,
  onCancelReservation,
  onNavigate,
  currentUser,
  onSwitchRole 
}) => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [favoriteDonors, setFavoriteDonors] = useState(SAVED_DONORS);
  const [viewRole, setViewRole] = useState(currentUser?.role || 'user');

  // If viewing Donor Dashboard
  if (viewRole === 'donor') {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <DonorDashboard 
            foodItems={foodItems}
            onOpenListFood={onOpenListFood}
            onSelectFood={onSelectFood}
            currentUser={currentUser}
            onSwitchRole={(newRole) => {
              setViewRole(newRole);
              if (onSwitchRole) onSwitchRole(newRole);
            }}
          />
        </div>
      </div>
    );
  }

  // Reserved items list
  const reservedItems = foodItems.filter(item => reservedIds.includes(item.id));
  
  // User's listings list
  const myListings = foodItems.filter(item => item.donor?.name === 'Community Donor' || item.donor?.name === (currentUser?.name || 'Sarah Jenkins'));

  const removeFavorite = (donorId) => {
    setFavoriteDonors(prev => prev.filter(d => d.id !== donorId));
  };

  const userName = currentUser?.name || 'Sarah Jenkins';
  const userBio = currentUser?.bio || 'Seattle Community Member • Joined Jan 2024';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* User Clean Header Card */}
        <div className="dashboard-hero-card">
          <div className="user-hero-info">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={userName} className="user-hero-avatar" />
            ) : (
              <div className="default-user-hero-avatar">
                <User size={36} />
              </div>
            )}

            <div className="user-hero-text">
              <div className="user-name-row">
                <h1>{userName}</h1>
                <span className="level-badge">Level 4 Rescuer</span>
                {currentUser?.isEmailVerified ? (
                  <span className="verified-account-tag"><ShieldCheck size={13} /> Verified Account</span>
                ) : (
                  <span className="unverified-account-tag"><AlertTriangle size={12} /> Pending Verification</span>
                )}
                <button 
                  className="btn-role-switch-header"
                  onClick={() => {
                    setViewRole('donor');
                    if (onSwitchRole) onSwitchRole('donor');
                  }}
                >
                  <ArrowRightLeft size={13} /> Switch to Donor Portal
                </button>
              </div>
              <p className="user-hero-subtitle">
                {userBio}
              </p>
              <div className="impact-mini-row">
                <span className="mini-impact-tag">95.2 kg CO₂ Saved</span>
                <span className="mini-impact-tag">38 Meals Rescued</span>
                <span className="mini-impact-tag">4.9 Rating</span>
              </div>
            </div>
          </div>

          <div className="user-hero-actions">
            <button className="btn-hero-list-food" onClick={onOpenListFood}>
              <Plus size={16} /> List Food Donation
            </button>
            <button className="btn-hero-find-food" onClick={() => onNavigate('discover')}>
              Find Food Near Me
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="kpi-grid">
          
          <div className="kpi-card">
            <div className="kpi-icon-box">
              <UtensilsCrossed size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Meals Rescued</span>
              <span className="kpi-value">{38 + reservedIds.length}</span>
              <span className="kpi-subtext">Prevented from waste</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box">
              <Leaf size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">CO₂ Offset</span>
              <span className="kpi-value">95.2 kg</span>
              <span className="kpi-subtext">Greenhouse gas saved</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box">
              <Clock size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Active Pickups</span>
              <span className="kpi-value">{reservedItems.length}</span>
              <span className="kpi-subtext">Ready for pickup today</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box">
              <HeartHandshake size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Donations Given</span>
              <span className="kpi-value">{14 + myListings.length}</span>
              <span className="kpi-subtext">Surplus items shared</span>
            </div>
          </div>

        </div>

        {/* Clean Line Tabs Bar */}
        <div className="dashboard-tabs-bar">
          <button 
            className={`dash-tab-link ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            My Pickups ({reservedItems.length})
          </button>
          
          <button 
            className={`dash-tab-link ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Food Listings ({myListings.length})
          </button>
          
          <button 
            className={`dash-tab-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Impact & Badges
          </button>
          
          <button 
            className={`dash-tab-link ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Donors ({favoriteDonors.length})
          </button>
        </div>

        {/* Tab 1: My Pickups */}
        {activeTab === 'reservations' && (
          <div className="tab-content">
            {reservedItems.length > 0 ? (
              <div className="reservations-list">
                {reservedItems.map(food => (
                  <div key={food.id} className="reservation-card">
                    <img src={food.images[0]} alt={food.title} className="res-card-image" />
                    
                    <div className="res-card-details">
                      <div className="res-card-top">
                        <span className="res-category-badge">{food.category}</span>
                        <span className="res-status-badge">
                          <CheckCircle2 size={13} /> Ready for Pickup
                        </span>
                      </div>

                      <h3 className="res-card-title" onClick={() => onSelectFood(food)}>
                        {food.title}
                      </h3>

                      <div className="res-info-row">
                        <span>Donor: {food.donor?.name}</span>
                        <span className="info-dot">•</span>
                        <span>{food.pickupWindow}</span>
                      </div>

                      <div className="res-address-row">
                        <MapPin size={14} className="map-icon" />
                        <span>{food.address}</span>
                      </div>

                      <div className="pickup-code-box">
                        <span className="code-label">Claim Code:</span>
                        <span className="code-value">#LO-{food.id.slice(-4).toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="res-card-actions">
                      <button className="btn-res-action primary" onClick={() => onSelectFood(food)}>
                        View Details
                      </button>
                      <button className="btn-res-action outline" onClick={() => onCancelReservation && onCancelReservation(food.id)}>
                        Cancel Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tab-state">
                <Clock size={36} className="empty-tab-icon" />
                <h3>No Active Pickups Right Now</h3>
                <p>Browse available surplus food nearby and claim a meal before it goes to waste.</p>
                <button className="btn-primary-tab-action" onClick={() => onNavigate('discover')}>
                  Explore Discover Page
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Food Listings */}
        {activeTab === 'listings' && (
          <div className="tab-content">
            <div className="listings-tab-header">
              <h3>Your Surplus Food Listings</h3>
              <button className="btn-add-listing-tab" onClick={onOpenListFood}>
                <Plus size={15} /> List New Item
              </button>
            </div>

            {myListings.length > 0 ? (
              <div className="my-listings-grid">
                {myListings.map(food => (
                  <div key={food.id} className="my-listing-card">
                    <div className="my-listing-img-box">
                      <img src={food.images[0]} alt={food.title} />
                      <span className="listing-status-tag">Active</span>
                    </div>

                    <div className="my-listing-content">
                      <h4>{food.title}</h4>
                      <p className="my-listing-desc">{food.description}</p>
                      
                      <div className="my-listing-meta">
                        <span>{food.expiresIn}</span>
                        <span>{food.distance} miles</span>
                      </div>

                      <div className="my-listing-actions">
                        <button className="btn-listing-action view" onClick={() => onSelectFood(food)}>
                          View Public Page
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tab-state">
                <UtensilsCrossed size={36} className="empty-tab-icon" />
                <h3>No Food Listings Posted Yet</h3>
                <p>Have surplus food from your kitchen or bakery? Share it with neighbors in seconds.</p>
                <button className="btn-primary-tab-action" onClick={onOpenListFood}>
                  Create First Listing
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Impact & Badges */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            
            <div className="impact-overview-card">
              <h3 className="impact-card-title">Environmental Progress Summary</h3>
              
              <div className="impact-progress-list">
                
                <div className="progress-item">
                  <div className="progress-info">
                    <span className="progress-name">Carbon Offset Goal (100 kg CO₂)</span>
                    <span className="progress-percentage">95.2%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '95.2%' }}></div>
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-info">
                    <span className="progress-name">Water Conserved (12,000 Liters)</span>
                    <span className="progress-percentage">78%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-info">
                    <span className="progress-name">Community Meals Shared (50 Goal)</span>
                    <span className="progress-percentage">76%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '76%' }}></div>
                  </div>
                </div>

              </div>
            </div>

            <div className="badges-section">
              <h3 className="section-subtitle">Earned Badges</h3>
              
              <div className="badges-grid">
                {BADGES.map(badge => (
                  <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="badge-icon-box">
                      <Award size={20} className="badge-icon" />
                    </div>
                    <div className="badge-info">
                      <h4>{badge.name}</h4>
                      <p>{badge.desc}</p>
                      <span className="badge-status-text">
                        {badge.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Saved Donors */}
        {activeTab === 'saved' && (
          <div className="tab-content">
            {favoriteDonors.length > 0 ? (
              <div className="saved-donors-grid">
                {favoriteDonors.map(donor => (
                  <div key={donor.id} className="saved-donor-card">
                    <img src={donor.avatar} alt={donor.name} className="donor-card-avatar" />
                    
                    <div className="saved-donor-body">
                      <h4>{donor.name}</h4>
                      <span className="donor-card-category">{donor.category}</span>
                      
                      <div className="donor-card-stats">
                        <span>★ {donor.rating}</span>
                        <span className="stats-dot">•</span>
                        <span>{donor.donations} donations</span>
                      </div>
                    </div>

                    <div className="saved-donor-actions">
                      <button className="btn-browse-donor" onClick={() => onNavigate('discover')}>
                        Browse Meals
                      </button>
                      <button className="btn-remove-fav" onClick={() => removeFavorite(donor.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tab-state">
                <Heart size={36} className="empty-tab-icon" />
                <h3>No Saved Donors Yet</h3>
                <p>Click the heart icon on any bakery or donor profile to save them here.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
