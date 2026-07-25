import React, { useState } from 'react';
import { X, Send, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import './ContactDonorModal.css';

const ContactDonorModal = ({ isOpen, onClose, food }) => {
  const [messages, setMessages] = useState([
    { sender: 'donor', text: `Hi! Thank you for your interest in ${food?.title || 'this item'}. What time would you like to pick it up?` }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen || !food) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: 'user', text: inputText.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Auto simulated reply from donor
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'donor', text: `Sounds great! Please come by during the pickup window (${food.pickupWindow}). See you soon!` }
      ]);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-donor-info">
            <img src={food.donor?.avatar} alt={food.donor?.name} className="chat-avatar" />
            <div>
              <h3>{food.donor?.name || 'Donor'}</h3>
              <span className="chat-item-subtitle">Inquiring about: {food.title}</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Chat Footer / Input */}
        <form onSubmit={handleSendMessage} className="chat-footer">
          <input 
            type="text"
            placeholder="Write a message to donor..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default ContactDonorModal;
