import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Send } from 'lucide-react';
import './ReportModal.css';

const REPORT_REASONS = [
  'Expired or Spoiled Food',
  'Misleading Description or Image',
  'Donor Unavailable at Pickup',
  'Unsafe Hygiene / Food Safety Concern',
  'Inappropriate Behavior or Abuse',
  'Other Concern'
];

const ReportModal = ({ isOpen, onClose, food, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');

  if (!isOpen || !food) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReport({
      id: `rep-${Date.now()}`,
      foodId: food.id,
      foodTitle: food.title,
      donorName: food.donor?.name || 'Unknown Donor',
      reason: selectedReason,
      details,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    });
    setDetails('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="report-modal-header">
          <div className="report-header-title">
            <ShieldAlert size={22} className="report-alert-icon" />
            <h2>Report Food Listing or Donor</h2>
          </div>
          <button className="report-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Target Summary */}
        <div className="report-target-summary">
          <strong>Item:</strong> {food.title}
          <span className="target-dot">•</span>
          <strong>Donor:</strong> {food.donor?.name}
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          
          <div className="form-group">
            <label>Select Reason for Report *</label>
            <div className="reasons-grid">
              {REPORT_REASONS.map(reason => (
                <button
                  key={reason}
                  type="button"
                  className={`reason-chip ${selectedReason === reason ? 'active' : ''}`}
                  onClick={() => setSelectedReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Additional Details / Explanation *</label>
            <textarea
              rows={3}
              required
              placeholder="Please describe the issue in detail to help our moderation team..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="report-notice">
            <AlertTriangle size={14} />
            <span>Reports are reviewed by platform admins within 24 hours. False reporting is subject to account review.</span>
          </div>

          <div className="report-modal-actions">
            <button type="button" className="btn-report-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-report-submit">
              <Send size={15} /> Submit Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ReportModal;
