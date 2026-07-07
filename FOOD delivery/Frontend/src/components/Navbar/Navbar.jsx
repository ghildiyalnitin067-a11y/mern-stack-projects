import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'


const Navbar = (setShowLogin) => {

  const [menu, setMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + difference * easeInOutCubic(progress));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const scrollToSection = (sectionId, menuName) => {
    setMenu(menuName);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const targetY = element.getBoundingClientRect().top + window.pageYOffset;
          smoothScrollTo(targetY);
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const targetY = element.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(targetY);
      }
    }
  };

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className="logo" />
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu == "home" ? "active" : ""}>Home</Link>
        <li onClick={() => scrollToSection('explore-menu', 'menu')} className={menu == "menu" ? "active" : ""}>menu</li>
        <li onClick={() => scrollToSection('app-download', 'mobile-app')} className={menu == "mobile-app" ? "active" : ""}>mobile App</li>
        <li onClick={() => scrollToSection('footer', 'contact-us')} className={menu == "contact-us" ? "active" : ""}>contact us</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className="dot"></div>
        </div>
        <button onClick={()=>setShowLogin(true)}>sign in</button>

      </div>
    </div>
  )
}

export default Navbar
