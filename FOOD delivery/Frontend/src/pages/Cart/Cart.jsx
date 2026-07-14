import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount ,url} = useContext(StoreContext);
  const navigate = useNavigate();

  const cartIsEmpty = getTotalCartAmount() === 0;

  return (
    <div className='cart'>
      {cartIsEmpty ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate('/')} className="cart-empty-btn">
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <hr />
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id}>
                    <div className="cart-items-title cart-items-item">
                      <img src={url+"/images/"+item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <div className="cart-quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          −
                        </button>
                        <span className="qty-value">{cartItems[item._id]}</span>
                        <button
                          className="qty-btn"
                          onClick={() => addToCart(item._id)}
                        >
                          +
                        </button>
                      </div>
                      <p>${item.price * cartItems[item._id]}</p>
                      <p
                        onClick={() => removeFromCart(item._id)}
                        className='cross'
                        title="Remove item"
                      >
                        <img src={assets.cross_icon} alt="remove" />
                      </p>
                    </div>
                    <hr />
                  </div>
                )
              }
              return null;
            })}
          </div>

          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
              </div>
              <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
            </div>
            <div className="cart-promo">
              <div>
                <p>If you have a promo code, enter it here</p>
                <div className="cart-promo-input">
                  <input type="text" placeholder='Promo code' />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
