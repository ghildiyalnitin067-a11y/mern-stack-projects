import { isConnectedToMongo } from '../config/db.js';
import Food from '../models/FoodModel.js';

let dynamicFoodStore = [];

export const getFoodListings = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const items = await Food.find({ status: 'Available' }).sort({ createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    } else {
      return res.json({ success: true, count: dynamicFoodStore.length, data: dynamicFoodStore });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnectedToMongo) {
      const item = await Food.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: item });
    } else {
      const item = dynamicFoodStore.find(f => f.id === id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFoodListing = async (req, res) => {
  try {
    const foodData = req.body;

    if (!foodData.title || !foodData.category || !foodData.description) {
      return res.status(400).json({ success: false, message: 'Missing required title, category, or description.' });
    }

    if (isConnectedToMongo) {
      const newFood = await Food.create(foodData);
      return res.status(201).json({ success: true, data: newFood });
    } else {
      const newItem = {
        id: `food-${Date.now()}`,
        ...foodData,
        status: 'Available',
        createdAt: new Date().toISOString()
      };
      dynamicFoodStore.unshift(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFoodListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnectedToMongo) {
      await Food.findByIdAndDelete(id);
    } else {
      dynamicFoodStore = dynamicFoodStore.filter(f => f.id !== id);
    }
    res.json({ success: true, message: 'Food listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
