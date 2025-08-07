// First we need to import axios.js
import axios from 'axios';
import useAuthedUserStore from '../store/client/useAuthedUserStore';
// Next we make an 'instance' of it
const api = axios.create({
// .. where we make our configurations
    baseURL: import.meta.env.VITE_API_URL,
});

// Where you would set stuff like your 'Authorization' header, etc ...

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Also add/ configure interceptors && all the other cool stuff
api.interceptors.response.use(
  (response) => {
    if(response.status === 401) {
      useAuthedUserStore.getState().setAuthedUser(null)
      localStorage.removeItem('token')
      window.location.href = window.location.href + 'signin';
    }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    if(error.response.status === 401) {
      useAuthedUserStore.getState().setAuthedUser(null)
      localStorage.removeItem('token')
      window.location.href = window.location.href + 'signin';
    }
    
    return Promise.reject(error.response.data);
  }
);


export default api;