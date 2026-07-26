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
  const token = localStorage.getItem('leftover_admin_token') || localStorage.getItem('leftover_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiGetAdminUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const apiUpdateUserStatus = async (userId, status) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
};

export const apiUpdateUserRole = async (userId, role) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
};

export const apiGetAdminReports = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reports`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const apiUpdateReportStatus = async (reportId, status) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
};

export const apiGetAdminAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};
