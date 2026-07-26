import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Layers, Globe, Loader } from 'lucide-react';
import './MapView.css';

// Haversine formula — returns distance in kilometres
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

const MapView = ({
  address = 'Connaught Place, New Delhi, India',
  lat = 28.6315,   // New Delhi default (India)
  lng = 77.2167,
  donorName = 'Donor Location',
  title = 'Food Item',
  pickupWindow = 'Today, 2:00 PM - 5:00 PM',
  distance = 1.2
}) => {
  const [mapType, setMapType] = useState('roadmap');
  const [zoomLevel] = useState(15);
  const [userLocation, setUserLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');
  const [liveDistance, setLiveDistance] = useState(distance);
  const [isLocating, setIsLocating] = useState(false);

  // Map embed URLs
  const googleRoadmapUrl  = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=${zoomLevel}&output=embed`;
  const googleSatelliteUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=${zoomLevel}&output=embed`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.015}%2C${lng + 0.015}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || `${lat},${lng}`)}`;

  // Auto-detect GPS silently on mount — updates distance without showing UI status
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        const realDist = calculateHaversineDistance(userLat, userLng, lat, lng);
        setLiveDistance(realDist);
      },
      () => { /* silent fail — user can click button manually */ },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  // Manual GPS button — shows explicit status banner
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoStatus('Locating your GPS position...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        const realDist = calculateHaversineDistance(userLat, userLng, lat, lng);
        setLiveDistance(realDist);
        setGeoStatus(`✅ GPS Located! ${realDist} km from your current location.`);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeoStatus('⚠️ Unable to retrieve your GPS location. Please allow location access in your browser.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Estimate travel time at avg Indian city speed ~25 km/h
  const travelMinutes = Math.max(2, Math.round((liveDistance / 25) * 60));

  return (
    <div className="live-map-card">

      {/* Top Map View Mode Toggles */}
      <div className="map-toolbar">
        <div className="map-type-toggles">
          <button
            type="button"
            className={`map-toggle-btn ${mapType === 'roadmap' ? 'active' : ''}`}
            onClick={() => setMapType('roadmap')}
          >
            <Compass size={14} /> Map View
          </button>
          <button
            type="button"
            className={`map-toggle-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            <Layers size={14} /> Satellite
          </button>
          <button
            type="button"
            className={`map-toggle-btn ${mapType === 'osm' ? 'active' : ''}`}
            onClick={() => setMapType('osm')}
          >
            <Globe size={14} /> OpenStreetMap
          </button>
        </div>

        <button type="button" className="btn-detect-gps" onClick={handleDetectGPS} disabled={isLocating}>
          {isLocating ? <Loader size={14} className="spin-anim" /> : <Navigation size={14} />}
          <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
        </button>
      </div>

      {geoStatus && (
        <div className="gps-status-banner">
          <span>{geoStatus}</span>
        </div>
      )}

      {/* Live Map Iframe */}
      <div className="live-map-viewport">
        <iframe
          title={`Live Map — ${donorName}`}
          src={
            mapType === 'roadmap'
              ? googleRoadmapUrl
              : mapType === 'satellite'
                ? googleSatelliteUrl
                : osmEmbedUrl
          }
          className="live-map-iframe"
          loading="lazy"
          allowFullScreen
        ></iframe>

        {/* Distance Badge Overlay */}
        <div className="live-travel-badge">
          <MapPin size={14} className="pin-accent-icon" />
          <span>
            {userLocation
              ? `${liveDistance} km away • ~${travelMinutes} min drive`
              : `${liveDistance} km away (approx.)`}
          </span>
        </div>
      </div>

      {/* Footer: Address + Directions */}
      <div className="live-map-footer">
        <div className="address-details-box">
          <strong>{donorName}</strong>
          <p>{address}</p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-live-directions"
        >
          <Navigation size={16} />
          <span>Open Turn-by-Turn Directions</span>
          <ExternalLink size={14} />
        </a>
      </div>

    </div>
  );
};

export default MapView;
