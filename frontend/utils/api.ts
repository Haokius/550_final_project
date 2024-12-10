import axios from 'axios';


const API_URL = 'http://localhost:8000';  

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// export const logout = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await api.post('/users/logout', {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     localStorage.removeItem('token');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const trackCompanies = async (companies: CompanyList) => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await api.post('/users/companies', companies, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const untrackCompany = async (companyData: CompanyDelete) => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await api.delete('/users/companies', {
//       headers: { Authorization: `Bearer ${token}` },
//       data: companyData
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteUser = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await api.delete('/users/delete', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     localStorage.removeItem('token');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getTrackedCompaniesData = async (): Promise<CompanyData[]> => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await api.get('/users/companies/data', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

