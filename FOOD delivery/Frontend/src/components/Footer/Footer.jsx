import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
         <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Tomato is your go-to food delivery platform, bringing the best restaurants and home-cooked meals straight to your doorstep. We are committed to delivering fresh, delicious food with fast and reliable service. Enjoy a seamless ordering experience every time.</p>
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
                    <li>Delivery</li>
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
