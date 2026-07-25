import React, { useState } from 'react';
import { 
  Store, Plus, Clock, CheckCircle2, AlertCircle, 
  Trash2, ShieldCheck, Star, Users, PackageCheck, HeartHandshake, Eye
} from 'lucide-react';
import './DonorDashboard.css';

const INITIAL_DONOR_CLAIMS = [
  {
    id: 'claim-1',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.r@example.com',
    itemTitle: 'Fresh Assorted Pastries',
    claimCode: '#LO-OD-1',
    slot: '3:00 PM - 3:15 PM',
    status: 'Ready for Pickup',
    portions: 1
  },
  {
    id: 'claim-2',
    customerName: 'Maria Garcia',
    customerEmail: 'maria.g@example.com',
    itemTitle: 'Assorted Gourmet Cupcakes',
    claimCode: '#LO-8921',
    slot: '4:15 PM - 4:30 PM',
    status: 'Ready for Pickup',
    portions: 2
  }
];

const DonorDashboard = ({ 
  foodItems = [], 
  onOpenListFood, 
  onSelectFood,
  currentUser,
  onSwitchRole 
}) => {
  const [activeTab, setActiveTab] = useState('claims');
  const [incomingClaims, setIncomingClaims] = useState(INITIAL_DONOR_CLAIMS);

  // Filter listings created by donors
  const donorListings = foodItems;

  const handleVerifyClaim = (claimId) => {
    setIncomingClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        return { ...claim, status: 'Completed' };
      }
      return claim;
    }));
  };

  const donorName = currentUser?.name || 'Sunny Bakery & Cafe';

  return (
    <div className="donor-portal-container">
      
      {/* Donor Portal Hero Header */}
      <div className="donor-hero-card">
        <div className="donor-hero-info">
          <div className="donor-store-icon">
            <Store size={32} />
          </div>

          <div className="donor-hero-text">
            <div className="donor-title-row">
              <h1>{donorName}</h1>
              <span className="donor-badge">Verified Food Donor</span>
              <button className="btn-role-switch" onClick={() => onSwitchRole('user')}>
                Switch to Rescuer Mode
              </button>
            </div>
            <p className="donor-subtitle">
              Commercial Food Partner • Member since Jan 2024 • Seattle, WA
            </p>
            <div className="donor-stats-row">
              <span className="mini-stat-tag">★ 4.9 Store Rating</span>
              <span className="mini-stat-tag">120 Total Meals Donated</span>
              <span className="mini-stat-tag">98 Neighbors Fed</span>
            </div>
          </div>
        </div>

        <div className="donor-hero-actions">
          <button className="btn-donor-list-food" onClick={onOpenListFood}>
            <Plus size={16} /> List Surplus Food
          </button>
        </div>
      </div>

      {/* KPI Stats Grid for Donors */}
      <div className="kpi-grid">
        
        <div className="kpi-card">
          <div className="kpi-icon-box">
            <HeartHandshake size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Donations Given</span>
            <span className="kpi-value">120</span>
            <span className="kpi-subtext">Surplus meals rescued</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <Users size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Neighbors Impacted</span>
            <span className="kpi-value">98</span>
            <span className="kpi-subtext">Local community members</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <PackageCheck size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Listings</span>
            <span className="kpi-value">{donorListings.length}</span>
            <span className="kpi-subtext">Available for pickup</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <Star size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Donor Rating</span>
            <span className="kpi-value">4.9 ★</span>
            <span className="kpi-subtext">Based on 85 reviews</span>
          </div>
        </div>

      </div>

      {/* Tabs Line Bar */}
      <div className="dashboard-tabs-bar">
        <button 
          className={`dash-tab-link ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          Incoming Customer Claims ({incomingClaims.filter(c => c.status === 'Ready for Pickup').length})
        </button>

        <button 
          className={`dash-tab-link ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Active Food Inventory ({donorListings.length})
        </button>
      </div>

      {/* Tab 1: Incoming Customer Claims */}
      {activeTab === 'claims' && (
        <div className="tab-content">
          <div className="claims-section-header">
            <h3>Customer Pickup Reservations</h3>
            <p>Verify customer claim codes when they arrive at your store counter.</p>
          </div>

          <div className="claims-list">
            {incomingClaims.map(claim => (
              <div key={claim.id} className="donor-claim-card">
                <div className="claim-main-info">
                  <div className="claim-top-row">
                    <span className="claim-customer-name">{claim.customerName}</span>
                    <span className={`claim-status-pill ${claim.status === 'Completed' ? 'completed' : 'pending'}`}>
                      {claim.status === 'Completed' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      {claim.status}
                    </span>
                  </div>

                  <h4 className="claim-item-title">{claim.itemTitle}</h4>
                  <p className="claim-slot-text">Pickup Window: {claim.slot} • {claim.portions} Portion(s)</p>

                  <div className="donor-code-verify-box">
                    <span className="verify-code-label">Customer Claim Code:</span>
                    <span className="verify-code-value">{claim.claimCode}</span>
                  </div>
                </div>

                <div className="claim-action-side">
                  {claim.status === 'Completed' ? (
                    <button className="btn-claim-verified" disabled>
                      <CheckCircle2 size={16} /> Pickup Verified
                    </button>
                  ) : (
                    <button className="btn-verify-code" onClick={() => handleVerifyClaim(claim.id)}>
                      <ShieldCheck size={16} /> Verify & Complete Pickup
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Active Inventory */}
      {activeTab === 'inventory' && (
        <div className="tab-content">
          <div className="listings-tab-header">
            <h3>Live Surplus Inventory</h3>
            <button className="btn-add-listing-tab" onClick={onOpenListFood}>
              <Plus size={15} /> List New Item
            </button>
          </div>

          <div className="donor-inventory-grid">
            {donorListings.map(food => (
              <div key={food.id} className="inventory-card">
                <img src={food.images[0]} alt={food.title} className="inventory-img" />
                <div className="inventory-body">
                  <div className="inventory-top">
                    <span className="inventory-category">{food.category}</span>
                    <span className="inventory-status">{food.status || 'Available'}</span>
                  </div>
                  <h4>{food.title}</h4>
                  <p className="inventory-desc">{food.description}</p>
                  <p className="inventory-window"><Clock size={12} /> {food.pickupWindow}</p>
                </div>
                <div className="inventory-footer">
                  <button className="btn-inv-view" onClick={() => onSelectFood(food)}>
                    <Eye size={14} /> View Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DonorDashboard;
