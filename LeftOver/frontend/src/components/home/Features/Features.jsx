import React from 'react';
import { Search, Calendar } from 'lucide-react';
import shareImg from '../../../assets/images/feature-share.png';
import supportImg from '../../../assets/images/feature-support.png';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-main-title">
          Everything you need to make a difference
        </h2>

        <div className="features-grid">
         
          <div className="features-row row-top">
            <div className="feature-card image-card share-card">
              <img src={shareImg} alt="Share Food" className="card-bg-img" />
              <div className="image-card-overlay">
                <h3 className="card-title text-white">Share</h3>
                <p className="card-desc text-white-muted">
                  Easily list surplus food from your home, restaurant, or grocery store in seconds.
                </p>
              </div>
            </div>

            <div className="feature-card pastel-card discover-card">
              <div className="icon-badge badge-blue">
                <Search size={20} className="icon-blue" />
              </div>
              <h3 className="card-title">Discover</h3>
              <p className="card-desc">
                Find available meals and ingredients in your local neighborhood instantly.
              </p>
            </div>
          </div>

       
          <div className="features-row row-bottom">
            <div className="feature-card pastel-card reserve-card">
              <div className="icon-badge badge-orange">
                <Calendar size={20} className="icon-orange" />
              </div>
              <h3 className="card-title">Reserve</h3>
              <p className="card-desc">
                Claim items securely and coordinate pick-up times that work for both parties.
              </p>
            </div>

            <div className="feature-card image-card support-card">
              <img src={supportImg} alt="Support Community" className="card-bg-img" />
              <div className="image-card-overlay">
                <h3 className="card-title text-white">Support</h3>
                <p className="card-desc text-white-muted">
                  Build a stronger, more sustainable community by ensuring no good food goes to waste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
