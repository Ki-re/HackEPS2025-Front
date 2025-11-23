import { BASE_URL } from "../config/cloudConstants";

const TOKEN_KEY = 'token';

// Mock data for development
const MOCK_DB = {
  userProfile: {
    id: 1,
    username: "HackEPS_User",
    email: "participant@hackeps.com",
    full_name: "Participant LleidaHack",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HackEPS2025"
  }
};

// Mock API for development
const api = {
  get: async (url) => {
    console.log(`📢 [MOCK API] GET request a: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (url.includes('/auth/me') || url.includes('/users/me')) {
      return { data: MOCK_DB.userProfile };
    }
    
    return { data: {} };
  },

  post: async (url, data) => {
    console.log(`📢 [MOCK API] POST request a: ${url}`, data);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (url.includes('login')) {
      return { data: { access_token: "mock-token-hackeps-super-segur" } };
    }

    return { data: { success: true, id: Math.floor(Math.random() * 1000) } };
  }
};

export const authService = {
  async login(username, password) {
    console.log(`🔑 Fent LOGIN MOCK amb usuari: ${username}`);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const fakeToken = response.data.access_token;
      localStorage.setItem(TOKEN_KEY, fakeToken);
      
      // Update the mock user data with the provided username
      MOCK_DB.userProfile.username = username || "HackEPS_User";
      
      return { success: true, token: fakeToken };
    } catch (error) {
      return { success: false, error: error.message || 'Error de login' };
    }
  },

  async fetchUser() {
    const token = this.getToken(); 
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isLoggedIn() {
    return !!this.getToken();
  }
};

export { api };
