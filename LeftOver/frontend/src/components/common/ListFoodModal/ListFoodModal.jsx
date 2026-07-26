import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Clock, MapPin, Sparkles, CheckCircle2, Camera, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { apiUploadImage } from '../../../services/api';
import './ListFoodModal.css';

const PRESET_IMAGES = [
  { label: 'Bakery / Pastries', url: '/images/pastries.png' },
  { label: 'Organic Veggies', url: '/images/veggie_box.png' },
  { label: 'Cooked Meal / Stew', url: '/images/veg_stew.png' },
  { label: 'Gourmet Cupcakes', url: '/images/cupcakes.png' },
  { label: 'Artisan Bread', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fruit Basket', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80' }
];

const ListFoodModal = ({ isOpen, onClose, onAddListing }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cooked');
  const [description, setDescription] = useState('');
  const [pickupWindow, setPickupWindow] = useState('Today, 2:00 PM - 6:00 PM');
  const [expiresIn, setExpiresIn] = useState('Exp. in 4h');
  const [address, setAddress] = useState('12 MG Road, Connaught Place, New Delhi, Delhi 110001');
  const [pickupInstructions, setPickupInstructions] = useState('Pick up at front entrance. Ring bell.');
  const [donorName, setDonorName] = useState('Community Donor');
  
  // Image handling states (supports up to 5 photos)
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]); // Array of base64 images
  const [selectedDietary, setSelectedDietary] = useState(['Vegetarian']);
  const [isSuccess, setIsSuccess] = useState(false);

  // Camera states & refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaStreamRef = useRef(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setCategory('Cooked');
    setDescription('');
    setPickupWindow('Today, 2:00 PM - 6:00 PM');
    setExpiresIn('Exp. in 4h');
    setAddress('123 Main Street, Seattle, WA');
    setPickupInstructions('Pick up at front entrance. Ring bell.');
    setDonorName('Community Donor');
    setSelectedImage(PRESET_IMAGES[0].url);
    setCustomImageUrl('');
    setUploadedImages([]);
    setSelectedDietary(['Vegetarian']);
  };

  const handleDietaryToggle = (tag) => {
    setSelectedDietary(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 1. Multi-File Upload Handler (up to 5 images)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Max 5 photos
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => {
            if (prev.length >= 5) return prev;
            return [...prev, reader.result];
          });
          setCustomImageUrl('');
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedPhoto = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. Start Camera Handler
  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check camera permissions or upload an image file instead.');
    }
  };

  // 3. Stop Camera Handler
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // 4. Snap Photo Handler
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setUploadedImages(prev => [...prev.slice(0, 4), capturedDataUrl]);
      setCustomImageUrl('');
      stopCamera();
    }
  };

  const handleCloseModal = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Process all uploaded photos (up to 5) or use selected preset/URL
    let finalImages = [];
    if (uploadedImages.length > 0) {
      const uploadPromises = uploadedImages.map(img => apiUploadImage(img, 'food_listings'));
      finalImages = await Promise.all(uploadPromises);
    } else if (customImageUrl.trim()) {
      finalImages = [customImageUrl.trim()];
    } else {
      finalImages = [selectedImage];
    }

    const newFoodItem = {
      id: `food-${Date.now()}`,
      title: title.trim(),
      category,
      distance: 0.3,
      expiresIn: expiresIn.trim(),
      isUrgent: expiresIn.toLowerCase().includes('h') || expiresIn.toLowerCase().includes('m'),
      donor: {
        id: `donor-${Date.now()}`,
        name: donorName.trim() || 'Generous Donor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        rating: 5.0,
        totalDonations: 1
      },
      images: finalImages,
      dietary: selectedDietary,
      ingredients: ['Freshly Prepared Surplus Food'],
      allergenNote: '* Fresh surplus food listed by community donor.',
      description: description.trim(),
      pickupWindow: pickupWindow.trim(),
      pickupInstructions: pickupInstructions.trim(),
      address: address.trim(),
      lat: 28.6315,   // New Delhi default
      lng: 77.2167,
      status: 'Available'
    };

    stopCamera();
    onAddListing(newFoodItem);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1600);
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <Sparkles className="header-sparkle-icon" size={22} />
            <h2>List Food Donation</h2>
          </div>
          <button className="modal-close-btn" onClick={handleCloseModal}>
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-box">
            <CheckCircle2 size={56} className="success-check-icon" />
            <h3>Food Listing Published!</h3>
            <p>Your food donation is now live on the Discover page. Thank you for reducing waste!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="list-food-form">
            
            {/* Title & Category */}
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Food Item Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fresh Baked Muffins, Organic Spinach Box..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group flex-1">
                <label>Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Bakery">Bakery</option>
                  <option value="Veggies">Veggies</option>
                  <option value="Cooked">Cooked</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description *</label>
              <textarea 
                rows="3"
                required
                placeholder="Describe the food, condition, quantity, and how it was prepared..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Pickup Window & Expiration */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Pickup Window *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Today, 2:00 PM - 5:00 PM" 
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                />
              </div>

              <div className="form-group flex-1">
                <label>Expires In *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Exp. in 3h or Exp. tomorrow" 
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                />
              </div>
            </div>

            {/* Donor Name & Address */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Donor / Bakery Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name or Bakery Name" 
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              <div className="form-group flex-1">
                <label>Pickup Address *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Street Address, City, State" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="form-group">
              <label>Pickup Instructions</label>
              <input 
                type="text" 
                placeholder="e.g. Come to side door, ring bell for pickup..." 
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
              />
            </div>

            {/* Dietary Tags */}
            <div className="form-group">
              <label>Dietary Information</label>
              <div className="dietary-checkboxes">
                {['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Dairy-Free'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-toggle-btn ${selectedDietary.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleDietaryToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Section: Camera + Upload + Presets */}
            <div className="form-group image-section-box">
              <label className="section-label">Food Photo *</label>

              {/* Action buttons: Camera vs Device Upload */}
              <div className="image-input-actions">
                <button 
                  type="button" 
                  className={`btn-photo-mode ${isCameraActive ? 'active' : ''}`}
                  onClick={startCamera}
                >
                  <Camera size={18} />
                  <span>Take Photo with Camera</span>
                </button>

                <button 
                  type="button" 
                  className="btn-photo-mode"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <Upload size={18} />
                  <span>Upload Image File</span>
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  multiple
                  className="hidden-file-input"
                  onChange={handleFileChange}
                />
              </div>

              {/* Live Camera Feed Viewport */}
              {isCameraActive && (
                <div className="camera-viewport-card">
                  <div className="camera-video-container">
                    <video ref={videoRef} autoPlay playsInline className="camera-video-feed"></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  </div>
                  {cameraError ? (
                    <p className="camera-error-msg">{cameraError}</p>
                  ) : (
                    <div className="camera-controls">
                      <button type="button" className="btn-snap-photo" onClick={takePhoto}>
                        <Camera size={20} />
                        <span>Capture Photo</span>
                      </button>
                      <button type="button" className="btn-cancel-camera" onClick={stopCamera}>
                        Cancel Camera
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Selected / Uploaded Image Previews Gallery */}
              {uploadedImages.length > 0 && !isCameraActive && (
                <div className="image-preview-card">
                  <span className="preview-tag">Uploaded Photos Gallery ({uploadedImages.length}/5):</span>
                  <div className="multi-preview-grid">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="thumb-preview-item">
                        <img src={img} alt={`Preview ${index + 1}`} className="uploaded-preview-img-thumb" />
                        <button type="button" className="btn-remove-thumb" onClick={() => removeFavorite ? removeUploadedPhoto(index) : removeUploadedPhoto(index)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Stock Images */}
              <div className="preset-images-section">
                <label className="sub-label">Or choose a preset food image:</label>
                <div className="preset-images-grid">
                  {PRESET_IMAGES.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`preset-img-option ${selectedImage === img.url && uploadedImages.length === 0 && !customImageUrl ? 'selected' : ''}`}
                      onClick={() => { 
                        setSelectedImage(img.url); 
                        setUploadedImages([]); 
                        setCustomImageUrl(''); 
                      }}
                    >
                      <img src={img.url} alt={img.label} />
                      <span>{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Image URL fallback */}
              <div className="custom-url-box">
                <label className="sub-label">Or paste custom Image URL:</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setUploadedImagePreview('');
                  }}
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn-submit-listing">
                <Plus size={18} />
                <span>Publish Listing</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default ListFoodModal;
