export const INITIAL_FOOD_ITEMS = [
  {
    id: 'food-1',
    title: 'Fresh Assorted Pastries',
    category: 'Bakery',
    distance: 0.5,
    expiresIn: 'Exp. in 2h',
    isUrgent: true,
    donor: {
      id: 'donor-1',
      name: 'Sunny Bakery',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.8,
      totalDonations: 85
    },
    images: [
      '/images/pastries.png',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Vegetarian'],
    ingredients: ['Contains Wheat', 'Contains Dairy', 'Contains Eggs'],
    allergenNote: '* Note: Produced in a facility that handles tree nuts.',
    description: 'A delight box of freshly baked croissants, fruit tarts, and cinnamon rolls left over from our morning shift. Baked fresh today, crisp and soft!',
    pickupWindow: 'Today, 3:00 PM - 6:00 PM',
    pickupInstructions: 'Sunny Bakery Front Counter. Show your LeftOver reservation code to our staff.',
    address: '452 Pine Street, Downtown, Seattle, WA',
    lat: 47.608013,
    lng: -122.335167,
    status: 'Available'
  },
  {
    id: 'food-2',
    title: 'Organic Veggie Box',
    category: 'Veggies',
    distance: 1.2,
    expiresIn: 'Exp. tomorrow',
    isUrgent: false,
    donor: {
      id: 'donor-2',
      name: 'Local Farm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 210
    },
    images: [
      '/images/veggie_box.png',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Vegan', 'Gluten-Free'],
    ingredients: ['100% Organic Vegetables', 'Kale', 'Bell Peppers', 'Tomatoes', 'Carrots'],
    allergenNote: '* Fresh produce directly from farm fields. Wash before consuming.',
    description: 'A wooden crate filled with surplus fresh organic vegetables harvested yesterday. Includes kale, heirloom tomatoes, sweet bell peppers, carrots, and fresh basil.',
    pickupWindow: 'Today & Tomorrow, 9:00 AM - 5:00 PM',
    pickupInstructions: 'Local Farm Fresh Stand. Drive up to the side barn and ask for Dave.',
    address: '88 Farmhouse Lane, Green Valley, WA',
    lat: 47.615013,
    lng: -122.320167,
    status: 'Available'
  },
  {
    id: 'food-3',
    title: 'Hearty Veg Stew',
    category: 'Cooked',
    distance: 0.1,
    expiresIn: 'Exp. in 30m',
    isUrgent: true,
    donor: {
      id: 'donor-3',
      name: 'Neighbor Dave',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.7,
      totalDonations: 34
    },
    images: [
      '/images/veg_stew.png',
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Chickpeas', 'Potatoes', 'Carrots', 'Tomatoes', 'Olive Oil', 'Herbs'],
    allergenNote: '* Prepared in a home kitchen.',
    description: 'Freshly cooked large pot of warm vegetable and chickpea stew. Served hot with herbs and spices. Perfect for a cozy lunch!',
    pickupWindow: 'Today, until 5:30 PM',
    pickupInstructions: 'Apt 4B, 120 Oak Street. Ring doorbell for Dave.',
    address: '120 Oak Street, Apt 4B, Seattle, WA',
    lat: 47.604013,
    lng: -122.331167,
    status: 'Available'
  },
  {
    id: 'food-4',
    title: 'Assorted Gourmet Cupcakes',
    category: 'Dessert',
    distance: 0.8,
    expiresIn: 'Exp. today',
    isUrgent: false,
    donor: {
      id: 'donor-4',
      name: 'Sweet Tooth Bakery',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 120
    },
    images: [
      '/images/cupcakes.png',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Contains Eggs', 'Contains Dairy', 'Vegetarian'],
    ingredients: ['Flour', 'Sugar', 'Butter', 'Eggs', 'Vanilla Bean', 'Cocoa Powder', 'Cream Cheese'],
    allergenNote: '* Note: Produced in a facility that also processes nuts.',
    description: 'We have about a dozen assorted gourmet cupcakes left over from a corporate event earlier today. Flavors include Red Velvet, Salted Caramel, and classic Vanilla Bean. They are perfectly fresh and beautifully decorated. We\'d love for these to go to a good home rather than going to waste!',
    pickupWindow: 'Today, 2:00 PM - 5:00 PM',
    pickupInstructions: 'Sweet Tooth Bakery - Downtown. Please come to the side door facing Elm Street. Ring the bell and let staff know you are here for the LeftOver pickup.',
    address: '123 Elm Street, Seattle, WA',
    lat: 47.609213,
    lng: -122.337167,
    status: 'Available'
  },
  {
    id: 'food-5',
    title: 'Sourdough Loaf',
    category: 'Bakery',
    distance: 0.8,
    expiresIn: '2h left',
    isUrgent: true,
    donor: {
      id: 'donor-4',
      name: 'Sweet Tooth Bakery',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 120
    },
    images: [
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Vegan', 'Vegetarian'],
    ingredients: ['Wheat Flour', 'Water', 'Wild Yeast Starter', 'Sea Salt'],
    allergenNote: '* Contains Gluten.',
    description: 'Freshly baked artisan sourdough loaf. Perfectly crusty outside, soft inside.',
    pickupWindow: 'Today, 2:00 PM - 5:00 PM',
    pickupInstructions: 'Sweet Tooth Bakery - Side Entrance on Elm Street.',
    address: '123 Elm Street, Seattle, WA',
    lat: 47.609213,
    lng: -122.337167,
    status: 'Available'
  },
  {
    id: 'food-6',
    title: 'Chocolate Chip Cookies',
    category: 'Dessert',
    distance: 0.8,
    expiresIn: '4h left',
    isUrgent: false,
    donor: {
      id: 'donor-4',
      name: 'Sweet Tooth Bakery',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 120
    },
    images: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Contains Eggs', 'Contains Dairy', 'Vegetarian'],
    ingredients: ['Butter', 'Brown Sugar', 'Dark Chocolate Chunks', 'Flour', 'Eggs'],
    allergenNote: '* Contains Dairy and Eggs.',
    description: 'Batch of 6 soft-baked chocolate chip cookies from today\'s morning bake.',
    pickupWindow: 'Today, 2:00 PM - 5:00 PM',
    pickupInstructions: 'Sweet Tooth Bakery - Side Entrance on Elm Street.',
    address: '123 Elm Street, Seattle, WA',
    lat: 47.609213,
    lng: -122.337167,
    status: 'Available'
  },
  {
    id: 'food-7',
    title: 'Plain Bagels',
    category: 'Bakery',
    distance: 0.8,
    expiresIn: '1h left',
    isUrgent: true,
    donor: {
      id: 'donor-4',
      name: 'Sweet Tooth Bakery',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 120
    },
    images: [
      'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80',
      '/images/pastries.png'
    ],
    dietary: ['Vegan', 'Vegetarian'],
    ingredients: ['Enriched Flour', 'Yeast', 'Malt', 'Salt'],
    allergenNote: '* Contains Wheat.',
    description: 'A few plain bagels left over. Great for a quick snack or sandwich.',
    pickupWindow: 'Today, 2:00 PM - 5:00 PM',
    pickupInstructions: 'Sweet Tooth Bakery - Side Entrance on Elm Street.',
    address: '123 Elm Street, Seattle, WA',
    lat: 47.609213,
    lng: -122.337167,
    status: 'Available'
  },
  {
    id: 'food-8',
    title: 'Fresh Fruit Basket',
    category: 'Fruits',
    distance: 2.5,
    expiresIn: 'Exp. in 1 day',
    isUrgent: false,
    donor: {
      id: 'donor-5',
      name: 'Green Orchard',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      rating: 4.9,
      totalDonations: 64
    },
    images: [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
    ],
    dietary: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Apples', 'Oranges', 'Bananas', 'Grapes', 'Pears'],
    allergenNote: '* Fresh fruit, 100% natural.',
    description: 'Surplus fruit basket with juicy apples, sweet oranges, ripe bananas, and seedless grapes.',
    pickupWindow: 'Tomorrow, 10:00 AM - 4:00 PM',
    pickupInstructions: 'Green Orchard Stand on 5th Ave.',
    address: '905 5th Ave, Seattle, WA',
    lat: 47.605213,
    lng: -122.333167,
    status: 'Available'
  }
];
