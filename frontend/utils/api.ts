import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};





export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const email = tokenPayload.email;

    await api.get('/users/companies/data');

    return {
      email: email,
      username: email.split('@')[0],
      id: tokenPayload.sub || 0,
      provider: null
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getSavedCompanies = async () => {
  try {
    const response = await api.get('/users/companies/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const addCompany = async (ciks: string[]) => {
  try {
    const response = await api.post('/users/companies', { ciks });
    return response.data;
  } catch (error) {
    console.error('Error adding company:', error);
    throw error;
  }
};

export const removeCompany = async (companyId: string) => {
  try {
    const response = await api.delete('/users/companies', {
      data: { cik: companyId }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing company:', error);
    throw error;
  }
};

export const getAvailableCompanies = async () => {
  try {
    const response = await api.get('/api/stocks');
    console.log('Available companies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching available companies:', error);
    throw error;
  }
};

