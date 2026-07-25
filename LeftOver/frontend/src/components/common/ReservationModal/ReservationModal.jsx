import React, { useState } from 'react';
import { X, Clock, MapPin, CheckCircle2, QrCode, ShoppingBag, ExternalLink, Calendar, Phone, ArrowRight, ShieldCheck, Navigation } from 'lucide-react';
import './ReservationModal.css';

const TIME_SLOTS = [
  '2:15 PM - 2:30 PM',
  '2:45 PM - 3:00 PM',
  '3:30 PM - 3:45 PM',
  '4:15 PM - 4:30 PM'
];

const ReservationModal = ({ isOpen, onClose, food, onConfirmReservation }) => {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('(206) 555-0192');
  const [note, setNote] = useState('');
  const [claimCode, setClaimCode] = useState('');

  if (!isOpen || !food) return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    const generatedCode = `#LO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setClaimCode(generatedCode);
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirmReservation({
      food,
      selectedSlot,
      quantity,
      phone,
      note,
      claimCode
    });
    setStep(1);
    onClose();
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(food.address || `${food.lat},${food.lng}`)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="order-modal-header">
          <div className="order-header-title">
            <ShoppingBag size={22} className="header-bag-icon" />
            <h2>{step === 1 ? 'Reserve Food Donation' : 'Digital Pickup Pass'}</h2>
          </div>
          <button className="order-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          /* Step 1: Order Details & Time Slot */
          <form onSubmit={handleNextStep} className="order-form">
            
            {/* Food Item Summary Box */}
            <div className="order-item-summary">
              <img src={food.images[0]} alt={food.title} className="order-item-img" />
              <div className="order-item-info">
                <span className="order-category-tag">{food.category}</span>
                <h3>{food.title}</h3>
                <p className="order-donor-text">By {food.donor?.name || 'Donor'}</p>
                <div className="order-window-pill">
                  <Clock size={13} /> {food.pickupWindow}
                </div>
              </div>
            </div>

            {/* Select Time Slot */}
            <div className="form-group">
              <label>Select Estimated Pickup Time *</label>
              <div className="time-slots-grid">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity / Portions & Phone */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Portions / Quantity</label>
                <div className="quantity-counter">
                  <button 
                    type="button" 
                    className="counter-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="counter-value">{quantity} portion(s)</span>
                  <button 
                    type="button" 
                    className="counter-btn"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group flex-1">
                <label>Contact Phone Number *</label>
                <div className="input-icon-box">
                  <Phone size={16} className="input-inner-icon" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Special Request / Pickup Note */}
            <div className="form-group">
              <label>Special Pickup Note (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. I will bring my own bag/container..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Footer Action */}
            <div className="order-modal-actions">
              <button type="button" className="btn-order-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-order-confirm">
                <span>Confirm & Get Pickup Pass</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        ) : (
          /* Step 2: Digital Pickup Pass Ticket */
          <div className="digital-ticket-view">
            
            <div className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-brand">
                  <span className="brand-dark">Left</span>
                  <span className="brand-green">Over</span>
                </div>
                <span className="ticket-status-pill">Claim Verified</span>
              </div>

              <div className="ticket-body">
                <div className="ticket-main-info">
                  <h3>{food.title}</h3>
                  <p className="ticket-donor">Donor: {food.donor?.name}</p>
                </div>

                <div className="ticket-qr-section">
                  <div className="barcode-simulation">
                    <span>||| | |||| | || ||| || ||| | |||</span>
                    <span className="barcode-code">{claimCode}</span>
                  </div>
                </div>

                <div className="ticket-details-grid">
                  <div className="ticket-detail-item">
                    <span className="detail-label">Pickup Time</span>
                    <span className="detail-val">{selectedSlot}</span>
                  </div>
                  <div className="ticket-detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-val">{quantity} Portion(s)</span>
                  </div>
                  <div className="ticket-detail-item full">
                    <span className="detail-label">Pickup Address</span>
                    <span className="detail-val">{food.address}</span>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-ticket-maps"
                >
                  <Navigation size={16} />
                  <span>Open in Google Maps for Directions</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="ticket-actions">
              <button className="btn-done-pass" onClick={handleFinalConfirm}>
                <CheckCircle2 size={18} />
                <span>Save to Dashboard & Done</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ReservationModal;
