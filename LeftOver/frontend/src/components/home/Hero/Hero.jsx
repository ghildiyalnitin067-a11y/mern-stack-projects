import React from 'react';
import heroImage from '../../../assets/images/hero-dining.png';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
      
        <div className="hero-content">
          <h1 className="hero-title">
            Reduce Food Waste.
            <span className="title-accent"> Feed Someone Today.</span>
          </h1>
          <p className="hero-description">
            Join our community-driven platform to share surplus food, discover local meals, and make a real impact on your neighborhood and the environment.
          </p>
          <div className="hero-buttons">
            <button className="btn-hero-primary">Share Food</button>
            <button className="btn-hero-secondary">Find Food</button>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img src={heroImage} alt="People dining together sharing food" className="hero-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
