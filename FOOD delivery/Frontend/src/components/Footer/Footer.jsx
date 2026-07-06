import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
         <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, quam! Lorem ipsum dolor sit amet consectetur adipisicing elit. A velit quo ea culpa natus numquam accusantium aliquid quam non unde?</p>
                 <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                 </div>
            </div>
            <div className="footer-content-center">
                  <h2>COMPANY</h2>
                  <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivey</li>
                    <li>Privacy policy</li>
                  </ul>
            </div>
            
            <div className="footer-content-right">
                 <h2>Get IN TOUCH</h2>
                 <ul>
                    <li>+91 9625622526</li>
                    <li>ghildiyalnitin067@gmail.com</li>
                 </ul>
            </div>
            
         </div>
         <hr />
         <p className="footer-copyright">
            Copyright 2026 @ Tomato.com -All Right Reserved.</p>
      
    </div>
  )
}

export default Footer
