import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Layers, Globe } from 'lucide-react';
import './MapView.css';

// Haversine formula to calculate real distance between two lat/lng points in miles
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
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
  address = '123 Elm Street, Seattle, WA', 
  lat = 47.609213, 
  lng = -122.337167, 
  donorName = 'Donor Location',
  title = 'Food Item',
  pickupWindow = 'Today, 2:00 PM - 5:00 PM',
  distance = 0.8
}) => {
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap', 'satellite', 'osm'
  const [zoomLevel, setZoomLevel] = useState(15);
  const [userLocation, setUserLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');
  const [liveDistance, setLiveDistance] = useState(distance);

  // URLs for live map embeds
  const googleRoadmapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=${zoomLevel}&output=embed`;
  const googleSatelliteUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=${zoomLevel}&output=embed`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.015}%2C${lng + 0.015}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || `${lat},${lng}`)}`;

  // Detect real GPS location using HTML5 Geolocation API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('Locating your GPS position...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        const realDist = calculateHaversineDistance(userLat, userLng, lat, lng);
        setLiveDistance(realDist);
        setGeoStatus(`GPS Located! ${realDist} miles from your location.`);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeoStatus('Unable to retrieve your GPS location. Please allow location permissions.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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

        {/* Detect GPS Location Button */}
        <button type="button" className="btn-detect-gps" onClick={handleDetectGPS}>
          <Navigation size={14} />
          <span>Use My GPS Location</span>
        </button>
      </div>

      {geoStatus && (
        <div className="gps-status-banner">
          <span>{geoStatus}</span>
        </div>
      )}

      {/* Live Map Iframe Viewport */}
      <div className="live-map-viewport">
        <iframe
          title={`Live Map of ${donorName}`}
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

        {/* Live Distance Info Overlay */}
        <div className="live-travel-badge">
          <MapPin size={14} className="pin-accent-icon" />
          <span>{liveDistance} miles away • ~{Math.max(1, Math.round(liveDistance * 4))} min drive</span>
        </div>
      </div>

      {/* Card Footer with Direct Turn-by-Turn Directions */}
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
