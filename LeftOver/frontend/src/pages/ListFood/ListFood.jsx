import React from 'react';
import ListFoodModal from '../../components/common/ListFoodModal/ListFoodModal';
import './ListFood.css';

const ListFood = ({ onAddListing, onBackToDiscover }) => {
  return (
    <div className="list-food-page">
      <div className="list-food-page-container">
        <ListFoodModal 
          isOpen={true} 
          onClose={onBackToDiscover} 
          onAddListing={onAddListing} 
        />
      </div>
    </div>
  );
};

export default ListFood;
