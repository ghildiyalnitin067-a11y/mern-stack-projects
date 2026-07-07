# Tomato - Food Delivery Web Application 🍅

##Live demo :-https://mern-stack-projects-lovat.vercel.app/

A food delivery web app I'm building as a hands-on learning project using the MERN stack. Right now, the frontend is fully functional — you can browse the menu, add items to your cart, adjust quantities, and go through the checkout flow. The backend, admin panel, payments, and auth are still in progress.

> **Note:** This is a learning project inspired by the GreatStack MERN tutorial. I'm building it myself to really understand how all the pieces of a full-stack app fit together.

---

## What's Working So Far (Frontend)

Here's what the frontend can do right now:

- **Home Page** — A hero banner with a call-to-action, a menu explorer where you can filter by food categories (salads, rolls, desserts, etc.), and a grid of food items with prices and images.
- **Menu Browsing** — Click on a category to filter the food list, or click "All" to see everything. Each food item shows its name, description, price, and an image.
- **Add to Cart** — Hit the "+" button on any food item to add it. A counter shows up so you can increase or decrease the quantity right from the food card.
- **Cart Page** — See all your items in a clean table layout with item images, names, prices, quantities, and totals. You can bump quantities up or down, or remove items entirely. When the cart is empty, it shows a friendly empty state with a "Browse Menu" button.
- **Cart Badge** — A small dot appears on the basket icon in the navbar whenever you have items in your cart. It disappears when the cart is empty.
- **Place Order Page** — A delivery information form with fields for name, email, address, phone, etc. alongside a cart summary showing subtotal, delivery fee ($2 when you have items), and total.
- **Login/Sign Up Popup** — A modal that lets users toggle between login and create account forms. Has email, password fields, and a terms & conditions checkbox.
- **Smooth Scrolling** — The navbar links (Menu, Mobile App, Contact Us) smoothly scroll to their sections on the homepage, even if you're on a different page — it navigates home first, then scrolls.
- **App Download Section** — A section encouraging users to download the Tomato mobile app with Play Store and App Store badges.
- **Responsive Design** — The layout adapts to different screen sizes. On smaller screens, the header text hides, padding adjusts, and the grid shifts to fewer columns.
- **State Management** — All cart logic lives in a React Context (`StoreContext`) so any component can access cart items, add/remove functions, and the total amount without prop drilling.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Framework | React 19 + Vite 8                   |
| Routing   | React Router v7                     |
| State     | React Context API                   |
| Styling   | Vanilla CSS with custom properties  |
| Font      | Google Fonts (Outfit)               |
| Deploy    | Vercel                              |

---

## Project Structure

```
Frontend/
├── public/
│   └── header_img.png
├── src/
│   ├── assets/            # Images, icons, and food data
│   ├── components/
│   │   ├── AppDownload/   # App download CTA section
│   │   ├── ExploreMenu/   # Category filter menu
│   │   ├── FoodDisplay/   # Food items grid
│   │   ├── FoodItem/      # Individual food card with add-to-cart
│   │   ├── Footer/        # Site footer with links and socials
│   │   ├── Header/        # Hero banner with CTA
│   │   ├── LoginPopup/    # Login/signup modal
│   │   └── Navbar/        # Top navigation bar
│   ├── context/
│   │   └── StoreContext.jsx  # Cart state and logic
│   ├── pages/
│   │   ├── Cart/          # Shopping cart page
│   │   ├── Home/          # Landing page
│   │   └── PlaceOrder/    # Checkout/delivery info page
│   ├── App.jsx            # Routes and layout
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles and reset
├── vercel.json            # SPA rewrite rules for Vercel
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
# Clone the repo
git clone <repository-url>

# Go into the frontend folder
cd Frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Deploying to Vercel

The frontend is deployment-ready for Vercel. A `vercel.json` is already included to handle client-side routing.

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set the **Root Directory** to `Frontend`
4. Click Deploy — Vercel auto-detects Vite

---

## What's Coming Next

These are the things I still need to build:

- **Backend** — Node.js + Express API with MongoDB for storing users, food items, and orders
- **Authentication** — JWT-based login/signup with bcrypt password hashing
- **Stripe Payments** — Integrate Stripe so users can actually pay for orders
- **Admin Panel** — A separate dashboard to manage food items and view/update orders
- **Order History** — Let users see their past orders
- **Image Uploads** — Upload food images from the admin panel
- **Search** — Search food items by name
- **Promo Codes** — The input field is there on the cart page, just needs backend logic

---

## What I've Learned So Far

Building this frontend taught me quite a bit:

- How to structure a React project with reusable components and clean folder organization
- Using Context API for shared state instead of passing props through multiple levels
- Client-side routing with React Router, including programmatic navigation and smooth scrolling
- Conditional rendering patterns (ternary operators, short-circuit evaluation)
- Responsive CSS without any frameworks — just media queries and flexible units like `vw`
- How Vite works as a build tool and how to configure it for production
- Setting up Vercel deployment with SPA rewrites

---

## Acknowledgement

This project is part of my learning journey. I followed concepts from the GreatStack MERN Stack tutorial but wrote all the code myself to actually understand what's happening under the hood rather than just copying along.
