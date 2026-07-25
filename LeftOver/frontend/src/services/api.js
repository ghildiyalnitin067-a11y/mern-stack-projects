const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

const getAuthHeader = () => {
  const token = localStorage.getItem('leftover_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiRegisterUser = async (name, email, password, role = 'user') => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server connection error' };
  }
};
export const apiRegister = apiRegisterUser;

export const apiLoginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server connection error' };
  }
};
export const apiLogin = apiLoginUser;

export const apiSendOtp = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Connection error' };
  }
};

export const apiVerifyOtp = async (email, otp) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Connection error' };
  }
};

export const apiFetchFoodListings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/food`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const apiCreateFoodListing = async (foodData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(foodData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to connect to backend server' };
  }
};

export const apiCreateReservation = async (reservationData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reservationData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to submit reservation' };
  }
};

export const apiCancelReservation = async (reservationId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations/cancel/${reservationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to cancel reservation' };
  }
};

export const apiUploadImage = async (imageData, folder = 'general') => {
  try {
    if (!imageData || !imageData.startsWith('data:')) {
      return imageData; // Already a URL or preset image path
    }
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ image: imageData, folder })
    });
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    return imageData;
  } catch (err) {
    return imageData;
  }
};
