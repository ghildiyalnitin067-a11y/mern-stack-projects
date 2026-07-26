import React, { useState } from 'react';
import { 
  Store, Plus, Clock, CheckCircle2, AlertCircle, 
  Trash2, ShieldCheck, Star, Users, PackageCheck, HeartHandshake, Eye
} from 'lucide-react';
import './DonorDashboard.css';



const DonorDashboard = ({ 
  foodItems = [], 
  onOpenListFood, 
  onSelectFood,
  currentUser,
  onSwitchRole 
}) => {
  const [activeTab, setActiveTab] = useState('claims');
  const [incomingClaims, setIncomingClaims] = useState([]);

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
              Commercial Food Partner • Joined LeftOver Platform
            </p>
            <div className="donor-stats-row">
              <span className="mini-stat-tag">Verified Partner</span>
              <span className="mini-stat-tag">{donorListings.length} Active Listings</span>
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
            <span className="kpi-value">{donorListings.length}</span>
            <span className="kpi-subtext">Surplus meals listed</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <Users size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Completed Pickups</span>
            <span className="kpi-value">{incomingClaims.filter(c => c.status === 'Completed').length}</span>
            <span className="kpi-subtext">Rescued by community</span>
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
            <span className="kpi-label">Donor Status</span>
            <span className="kpi-value">Verified</span>
            <span className="kpi-subtext">Active contributor</span>
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
            {incomingClaims.length > 0 ? (
              incomingClaims.map(claim => (
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
              ))
            ) : (
              <div className="empty-tab-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Clock size={36} className="empty-tab-icon" style={{ color: '#94a3b8', marginBottom: '12px' }} />
                <h3>No Incoming Claims Yet</h3>
                <p style={{ color: '#64748b' }}>When customers reserve your surplus food, their claim details will appear here.</p>
              </div>
            )}
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
