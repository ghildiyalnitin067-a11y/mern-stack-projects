import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import Home from './pages/Home/Home';
import Discover from './pages/Discover/Discover';
import FoodDetail from './pages/FoodDetail/FoodDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import ListFoodModal from './components/common/ListFoodModal/ListFoodModal';
import ContactDonorModal from './components/common/ContactDonorModal/ContactDonorModal';
import ReservationModal from './components/common/ReservationModal/ReservationModal';
import AuthModal from './components/common/AuthModal/AuthModal';
import ProfileSettingsModal from './components/common/ProfileSettingsModal/ProfileSettingsModal';
import {
  apiFetchFoodListings,
  apiCreateFoodListing,
  apiCreateReservation,
  apiCancelReservation
} from './services/api';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('discover');
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [reservedIds, setReservedIds] = useState(() => {
    const saved = localStorage.getItem('leftover_reserved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('leftover_user');
    if (!saved) return null;
    const user = JSON.parse(saved);
    // Rehydrate avatar from its dedicated key (stored separately to avoid 5MB quota)
    const savedAvatar = localStorage.getItem('leftover_avatar');
    if (savedAvatar && user) user.avatar = savedAvatar;
    return user;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);

  const [isListFoodModalOpen, setIsListFoodModalOpen] = useState(false);
  const [reservingFoodItem, setReservingFoodItem] = useState(null);
  const [contactFoodItem, setContactFoodItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('leftover_theme') || 'light';
  });


  // Fetch food items from Express backend on mount
  useEffect(() => {
    async function loadBackendData() {
      const backendItems = await apiFetchFoodListings();
      if (backendItems && backendItems.length > 0) {
        setFoodItems(backendItems);
      }
    }
    loadBackendData();
  }, []);

  useEffect(() => {
    localStorage.setItem('leftover_reserved_ids', JSON.stringify(reservedIds));
  }, [reservedIds]);

  useEffect(() => {
    if (currentUser) {
      // Save user object WITHOUT avatar blob to keep localStorage small
      const { avatar, ...userWithoutAvatar } = currentUser;
      localStorage.setItem('leftover_user', JSON.stringify(userWithoutAvatar));
    } else {
      localStorage.removeItem('leftover_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('leftover_theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  
  // Auth Gate Helper
  const requireAuth = (actionCallback) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please Sign In or Create an Account to access this feature!');
      return false;
    }
    actionCallback();
    return true;
  };

  // Handlers
  const handleNavigate = (page) => {
    if (page === 'dashboard' && !currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please Sign In to access your Dashboard!');
      return;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData, token) => {
    setCurrentUser(userData);
    if (token) localStorage.setItem('leftover_token', token);
    showToast(`Welcome ${userData.name}! Logged in successfully.`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('leftover_token');
    localStorage.removeItem('leftover_user');
    localStorage.removeItem('leftover_avatar');
    showToast('Signed out of account.');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedProfile
    }));
    showToast('Profile updated successfully!');
  };

  const handleOpenReserveModal = (food) => {
    requireAuth(() => {
      if (!reservedIds.includes(food.id)) {
        setReservingFoodItem(food);
      }
    });
  };

  const handleConfirmReservation = async (reservationData) => {
    const foodId = reservationData.foodId;
    if (!reservedIds.includes(foodId)) {
      setReservedIds(prev => [...prev, foodId]);
      await apiCreateReservation(reservationData);
      showToast(`Meal reserved successfully! Claim code generated.`);
    }
  };

  const handleCancelReservation = async (foodId) => {
    setReservedIds(prev => prev.filter(id => id !== foodId));
    await apiCancelReservation(foodId);
    showToast(`Cancelled reservation.`);
  };

  const handleSwitchRole = (newRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
    showToast(`Switched view to ${newRole === 'donor' ? 'Food Donor Portal' : 'Food Rescuer View'}.`);
  };

  const handleAddListing = async (newItem) => {
    setFoodItems(prev => [newItem, ...prev]);
    await apiCreateFoodListing(newItem);
    showToast(`Successfully published "${newItem.title}"!`);
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      <Navbar 
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenListFood={() => requireAuth(() => setIsListFoodModalOpen(true))}
        theme={theme}
        toggleTheme={toggleTheme}
        reservedCount={reservedIds.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfileSettings={() => setIsProfileSettingsModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="main-content">
        {activePage === 'home' && (
          <Home 
            onExplore={() => handleNavigate('discover')}
            onListFood={() => setIsListFoodModalOpen(true)}
          />
        )}

        {activePage === 'discover' && (
          <Discover 
            foodItems={foodItems}
            onSelectFood={handleSelectFood}
            onReserveFood={handleOpenReserveModal}
            reservedIds={reservedIds}
          />
        )}

        {activePage === 'detail' && (
          <FoodDetail 
            food={selectedFood || foodItems[3] || foodItems[0]}
            allFoodItems={foodItems}
            onBack={() => handleNavigate('discover')}
            onReserve={handleOpenReserveModal}
            isReserved={reservedIds.includes(selectedFood?.id || (foodItems[3] || foodItems[0])?.id)}
            onContactDonor={(food) => setContactFoodItem(food)}
            onSelectFood={handleSelectFood}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard 
            foodItems={foodItems}
            reservedIds={reservedIds}
            onSelectFood={handleSelectFood}
            onOpenListFood={() => setIsListFoodModalOpen(true)}
            onCancelReservation={handleCancelReservation}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
          />
        )}

        {activePage === 'donate' && (
          <div className="placeholder-page-container">
            <div className="placeholder-card">
              <h2>List Surplus Food</h2>
              <p>Help neighbours by sharing food from your home, restaurant, or shop.</p>
              <button className="btn-hero-primary" onClick={() => setIsListFoodModalOpen(true)}>
                List Food Now
              </button>
            </div>
          </div>
        )}

        {activePage === 'mission' && (
          <div className="placeholder-page-container">
            <div className="placeholder-card">
              <h2>Our Mission</h2>
              <p>LeftOver connects people with surplus food to those who need it. Less waste, more community.</p>
              <button className="btn-hero-secondary" onClick={() => handleNavigate('discover')}>
                Browse Available Food
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ProfileSettingsModal
        isOpen={isProfileSettingsModalOpen}
        onClose={() => setIsProfileSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

      <ListFoodModal
        isOpen={isListFoodModalOpen}
        onClose={() => setIsListFoodModalOpen(false)}
        onAddListing={handleAddListing}
      />

      <ReservationModal
        isOpen={!!reservingFoodItem}
        onClose={() => setReservingFoodItem(null)}
        food={reservingFoodItem}
        onConfirmReservation={handleConfirmReservation}
      />

      <ContactDonorModal
        isOpen={!!contactFoodItem}
        onClose={() => setContactFoodItem(null)}
        food={contactFoodItem}
      />

      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
