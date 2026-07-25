import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Check } from 'lucide-react';
import FoodCard from '../../components/discover/FoodCard';
import './Discover.css';

const CATEGORIES = ['Bakery', 'Veggies', 'Cooked', 'Dessert', 'Fruits', 'Dairy'];
const DIETARY_OPTIONS = ['Vegan', 'Halal', 'Gluten-Free', 'Vegetarian', 'Dairy-Free'];

const Discover = ({ foodItems = [], onSelectFood, onReserveFood, reservedIds = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedDietary, setSelectedDietary] = useState([]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDietaryToggle = (diet) => {
    setSelectedDietary(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMaxDistance(10);
    setSelectedDietary([]);
  };

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesDonor = item.donor?.name?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesDonor && !matchesCategory) {
          return false;
        }
      }

      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(item.category)) {
          return false;
        }
      }

      if (item.distance > maxDistance) {
        return false;
      }

      if (selectedDietary.length > 0) {
        const itemDietary = item.dietary || [];
        const hasAllSelectedDietary = selectedDietary.every(tag =>
          itemDietary.some(dt => dt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasAllSelectedDietary) {
          return false;
        }
      }

      return true;
    });
  }, [foodItems, searchQuery, selectedCategories, maxDistance, selectedDietary]);

  const hasActiveFilters = searchQuery !== '' || selectedCategories.length > 0 || maxDistance < 10 || selectedDietary.length > 0;

  return (
    <div className="discover-page">
      <div className="discover-container">
        
        {/* Left Sidebar Filters */}
        <aside className="discover-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <h2 className="filter-title">Filters</h2>
              {hasActiveFilters && (
                <button className="btn-reset-filters" onClick={handleResetFilters}>
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>

            <div className="filter-divider"></div>

            {/* Category Filter */}
            <div className="filter-group">
              <h3 className="filter-subtitle">Category</h3>
              <div className="checkbox-list">
                {CATEGORIES.map(category => (
                  <label key={category} className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className="checkbox-custom">
                      <Check size={12} className="check-icon" />
                    </span>
                    <span className="checkbox-label">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="filter-group">
              <div className="distance-header">
                <h3 className="filter-subtitle">Distance</h3>
                <span className="distance-value">{maxDistance} miles</span>
              </div>
              <div className="slider-wrapper">
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.5" 
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                  className="distance-range"
                />
                <div className="range-labels">
                  <span>0m</span>
                  <span>10m+</span>
                </div>
              </div>
            </div>

            {/* Dietary Filter */}
            <div className="filter-group">
              <h3 className="filter-subtitle">Dietary</h3>
              <div className="dietary-pills-wrapper">
                {DIETARY_OPTIONS.map(diet => {
                  const isSelected = selectedDietary.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      className={`dietary-filter-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => handleDietaryToggle(diet)}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Main Grid */}
        <main className="discover-main">
          {/* Top Search Bar & Stats */}
          <div className="discover-top-bar">
            <div className="search-box-large">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search food, bakeries, meals..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            <div className="results-count">
              <span>Showing <strong>{filteredItems.length}</strong> available donations near you</span>
            </div>
          </div>

          {/* Grid of Food Cards */}
          {filteredItems.length > 0 ? (
            <div className="food-grid">
              {filteredItems.map(item => (
                <FoodCard 
                  key={item.id} 
                  food={item} 
                  onSelect={onSelectFood}
                  onReserve={onReserveFood}
                  isReserved={reservedIds.includes(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-discover-state">
              <div className="empty-icon-circle">
                <Search size={28} />
              </div>
              <h3>Nothing found</h3>
              <p>Try adjusting your category, distance slider, or search query to see more leftover listings.</p>
              <button className="btn-clear-all" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Discover;
