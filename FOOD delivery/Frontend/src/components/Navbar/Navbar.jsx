import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'


const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalCartAmount,token,setToken } = useContext(StoreContext);
  const logout = () =>{
     localStorage.removeItem("token")
     setToken("")
     navigate("/")
  }

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu == "home" ? "active" : ""}>Home</Link>
        <li onClick={() => scrollToSection('explore-menu', 'menu')} className={menu == "menu" ? "active" : ""}>menu</li>
        <li onClick={() => scrollToSection('app-download', 'mobile-app')} className={menu == "mobile-app" ? "active" : ""}>mobile App</li>
        <li onClick={() => scrollToSection('footer', 'contact-us')} className={menu == "contact-us" ? "active" : ""}>contact us</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart' ><img src={assets.basket_icon} alt="" /></Link>
          {getTotalCartAmount() > 0 ? <div className="dot"></div> : null}
        </div>
        {!token? 
          <button onClick={() => setShowLogin(true)}>sign in</button>:
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className='nav-profile-dropdown'>
              <li onClick={() => navigate("/myorders")}> <img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>

        }
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to='/' onClick={() => { setMenu("home"); setMobileMenuOpen(false); }} className={menu == "home" ? "active" : ""}>Home</Link>
          <p onClick={() => { scrollToSection('explore-menu', 'menu'); setMobileMenuOpen(false); }} className={menu == "menu" ? "active" : ""}>Menu</p>
          <p onClick={() => { scrollToSection('app-download', 'mobile-app'); setMobileMenuOpen(false); }} className={menu == "mobile-app" ? "active" : ""}>Mobile App</p>
          <p onClick={() => { scrollToSection('footer', 'contact-us'); setMobileMenuOpen(false); }} className={menu == "contact-us" ? "active" : ""}>Contact Us</p>
        </div>
      )}
    </div>
  )
}

export default Navbar
