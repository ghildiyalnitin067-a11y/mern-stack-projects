import React from 'react';
import Hero from '../../components/home/Hero/Hero';
import Stats from '../../components/home/Stats/Stats';
import Features from '../../components/home/Features/Features';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
