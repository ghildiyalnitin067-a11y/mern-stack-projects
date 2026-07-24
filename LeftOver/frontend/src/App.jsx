import React from 'react';
import Navbar from './components/common/Navbar/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/common/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
