import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Link as LinkIcon, User, Check, Loader } from 'lucide-react';
import { apiUploadImage } from '../../../services/api';
import './ProfileSettingsModal.css';

const ProfileSettingsModal = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [name, setName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.j@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '(206) 555-0192');
  const [bio, setBio] = useState(currentUser?.bio || 'Seattle Food Rescuer & Community Volunteer');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  // Photo Upload Tab
  const [photoSource, setPhotoSource] = useState('upload'); // 'upload', 'camera', 'url'
  const [customUrl, setCustomUrl] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Sync form state when modal opens or currentUser prop changes
  // Must be declared BEFORE the early return to obey React's Rules of Hooks
  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '+91 00000 00000');
      setBio(currentUser.bio || 'Community Food Rescuer & Volunteer');
      // Read avatar from dedicated localStorage key to avoid 5MB quota issues
      const savedAvatar = localStorage.getItem('leftover_avatar') || currentUser.avatar || '';
      setAvatar(savedAvatar);
      setSaveError('');
      setIsSaving(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const handleStartCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable on this device.');
      setIsCameraActive(false);
    }
  };

  // Capture Camera Snapshot
  const handleCaptureCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setAvatar(capturedDataUrl);
      handleStopCamera();
    }
  };

  // Stop Camera
  const handleStopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setAvatar(customUrl.trim());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    handleStopCamera();
    setIsSaving(true);
    setSaveError('');

    try {
      let finalAvatar = avatar;

      // Only call upload API if avatar is a new base64 blob (camera/file upload)
      if (avatar && avatar.startsWith('data:')) {
        const result = await apiUploadImage(avatar, 'avatars');
        finalAvatar = result || avatar;
      }

      // Store avatar separately in localStorage to avoid 5MB quota overflow
      // The main user object in localStorage should stay small
      try {
        if (finalAvatar) {
          localStorage.setItem('leftover_avatar', finalAvatar);
        } else {
          localStorage.removeItem('leftover_avatar');
        }
      } catch (quotaErr) {
        // If image is too large even for dedicated key, store URL only (Cloudinary URL)
        console.warn('Avatar localStorage quota exceeded, trying URL-only save:', quotaErr);
        if (finalAvatar && !finalAvatar.startsWith('data:')) {
          localStorage.setItem('leftover_avatar', finalAvatar);
        }
      }

      onUpdateProfile({
        name,
        email,
        phone,
        bio,
        avatar: finalAvatar
      });

      onClose();
    } catch (err) {
      console.error('Profile save error:', err);
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => { handleStopCamera(); onClose(); }}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="profile-modal-header">
          <h2>Edit Profile Settings</h2>
          <button className="profile-close-btn" onClick={() => { handleStopCamera(); onClose(); }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          
          {/* Avatar Upload Section */}
          <div className="avatar-edit-section">
            <div className="avatar-preview-box">
              {avatar ? (
                <img src={avatar} alt="Profile Preview" className="avatar-preview-img" />
              ) : (
                <div className="default-avatar-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>

            <div className="avatar-upload-controls">
              <label className="section-subtitle">Custom Profile Photo</label>
              
              <div className="photo-source-tabs">
                <button 
                  type="button" 
                  className={`source-tab ${photoSource === 'upload' ? 'active' : ''}`}
                  onClick={() => { handleStopCamera(); setPhotoSource('upload'); }}
                >
                  <Upload size={14} /> Upload File
                </button>
                <button 
                  type="button" 
                  className={`source-tab ${photoSource === 'camera' ? 'active' : ''}`}
                  onClick={() => { setPhotoSource('camera'); handleStartCamera(); }}
                >
                  <Camera size={14} /> Take Photo
                </button>
                <button 
                  type="button" 
                  className={`source-tab ${photoSource === 'url' ? 'active' : ''}`}
                  onClick={() => { handleStopCamera(); setPhotoSource('url'); }}
                >
                  <LinkIcon size={14} /> URL
                </button>
              </div>

              {photoSource === 'upload' && (
                <div className="upload-file-box">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input-hidden"
                  />
                  <button 
                    type="button" 
                    className="btn-select-file"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} /> Choose Photo from Device
                  </button>
                </div>
              )}

              {photoSource === 'camera' && (
                <div className="camera-picker-box">
                  {isCameraActive ? (
                    <div className="camera-viewport-mini">
                      <video ref={videoRef} autoPlay playsInline muted className="camera-video-mini" />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      <div className="camera-action-btns">
                        <button type="button" className="btn-snap-photo" onClick={handleCaptureCamera}>
                          <Camera size={14} /> Snap Photo
                        </button>
                        <button type="button" className="btn-stop-camera" onClick={handleStopCamera}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="btn-start-camera" onClick={handleStartCamera}>
                      <Camera size={15} /> Start Live Camera
                    </button>
                  )}
                  {cameraError && <p className="camera-err-text">{cameraError}</p>}
                </div>
              )}

              {photoSource === 'url' && (
                <div className="url-picker-box">
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                  <button type="button" className="btn-apply-url" onClick={handleApplyUrl}>
                    Apply URL
                  </button>
                </div>
              )}

            </div>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Email Address *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group flex-1">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio / Community Role</label>
            <input 
              type="text" 
              placeholder="e.g. Community Rescuer"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {saveError && <p className="profile-save-error">{saveError}</p>}

          <div className="profile-modal-actions">
            <button type="button" className="btn-profile-cancel" onClick={() => { handleStopCamera(); onClose(); }} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-profile-save" disabled={isSaving}>
              {isSaving ? (
                <><Loader size={16} className="spin-icon" /> Saving...</>
              ) : (
                <><Check size={16} /> Save Changes</>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProfileSettingsModal;
