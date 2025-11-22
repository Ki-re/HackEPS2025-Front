import axios from 'axios'; // Ho mantenim importat per si vols descomentar-ho, però no s'usa

// =========================================================================
// 🛠️ CONFIGURACIÓ DE MOCK (DADES FALSES)
// =========================================================================
// Aquí pots afegir tot el que la teva web necessiti mostrar (reptes, equips, etc.)
const MOCK_DB = {
  // L'usuari connectat
  userProfile: {
    id: 1,
    username: "HackEPS_User",
    email: "participant@hackeps.com",
    full_name: "Participant LleidaHack",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HackEPS2025"
  },
  // Dades genèriques per si fas un GET a altres rutes (Ex: /challenges)
  defaultList: [
    { id: 1, title: "Dada Mock 1", desc: "Això ve del fitxer local" },
    { id: 2, title: "Dada Mock 2", desc: "No estem connectats al backend" },
    { id: 3, title: "Dada Mock 3", desc: "Tot funciona perfecte!" }
  ]
};

// =========================================================================
// ⚠️ ZONA ORIGINAL (COMENTADA)
// =========================================================================
/*
const API_BASE_URL = "http://localhost:8000";
const LOGIN_ENDPOINT = '/api/v1/auth/login';
const USER_ME_ENDPOINT = '/api/v1/auth/me';
const TOKEN_KEY = 'token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

// =========================================================================
// 🚀 ZONA MOCK (ACTIVA PER LA DEMO)
// Substituïm l'objecte 'api' d'Axios per un de nostre manual
// =========================================================================
const TOKEN_KEY = 'token';

const api = {
  // 1. Simulador de GET
  get: async (url, config) => {
    console.log(`📢 [MOCK API] GET request a: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 400)); // Retard fake de 0.4s

    // Rutes específiques
    if (url.includes('/auth/me') || url.includes('/users/me')) {
      return { data: MOCK_DB.userProfile };
    }
    
    // Si tens una ruta de reptes, per exemple:
    if (url.includes('challenges') || url.includes('reptes')) {
        return { data: MOCK_DB.defaultList };
    }

    // Per defecte, si no sabem què és, tornem una llista genèrica per no petar
    return { data: MOCK_DB.defaultList };
  },

  // 2. Simulador de POST
  post: async (url, data) => {
    console.log(`📢 [MOCK API] POST request a: ${url}`, data);
    await new Promise(resolve => setTimeout(resolve, 400));

    // Si és Login
    if (url.includes('login')) {
        return { data: { access_token: "mock-token-hackeps-super-segur" } };
    }

    // Qualsevol altre POST (crear, enviar formularis...) torna èxit
    return { data: { success: true, id: Math.floor(Math.random() * 1000) } };
  },

  // 3. Simulador de PUT/DELETE
  put: async (url, data) => ({ data: { success: true } }),
  delete: async (url) => ({ data: { success: true } }),

  // 4. Interceptors Fake (perquè no peti el codi que intenta registrar-los)
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },
  
  // Helper per si algú fa api.defaults...
  defaults: { headers: { common: {} } }
};


// =========================================================================
// SERVEI D'AUTENTICACIÓ (ADAPTAT AL MOCK)
// =========================================================================

const authService = {
  
  // -----------------------------------------------------------------------
  // 1. FUNCIÓ DE LOGIN
  // -----------------------------------------------------------------------
  async login(username, password) {
    this.logout(); 

    // --- CODI ORIGINAL COMENTAT ---
    /*
    try {
      const loginData = { username: username, password: password };
      const response = await api.post(LOGIN_ENDPOINT, loginData); 

      const tokenData = response.data;
      
      if (tokenData.access_token) {
        localStorage.setItem(TOKEN_KEY, tokenData.access_token);
        return { success: true, token: tokenData.access_token };
      }
      return { success: false, error: 'Resposta de token inesperada.' };
    } catch (error) {
      // ... gestió d'errors original ...
      return { success: false, error: 'Error...' };
    }
    */
    // ------------------------------

    // --- CODI MOCK ---
    console.log(`🔑 Fent LOGIN MOCK amb usuari: ${username}`);
    
    // Simulem la crida a l'api fake (que ja hem definit a dalt que sempre va bé)
    const response = await api.post('/login', { username, password });
    
    const fakeToken = response.data.access_token;
    localStorage.setItem(TOKEN_KEY, fakeToken);

    window.location.href = '/create-cluster';
    
    return { success: true, token: fakeToken };
  },

  // -----------------------------------------------------------------------
  // 2. FUNCIÓ PER OBTENIR USUARI (fetchUser)
  // -----------------------------------------------------------------------
  async fetchUser() {
    const token = this.getToken(); 
    if (!token) return null;

    // --- CODI ORIGINAL COMENTAT ---
    /*
    try {
      const response = await api.get(USER_ME_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
       // ...
    }
    */
    // ------------------------------

    // --- CODI MOCK ---
    // Cridem l'api fake, que retornarà MOCK_DB.userProfile
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (e) {
        return null;
    }
  },

  // -----------------------------------------------------------------------
  // 3. FUNCIONS Utilitaries (SENSE CANVIS)
  // -----------------------------------------------------------------------
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    // Opcional: window.location.reload();
  },
  
  isLoggedIn() {
    return !!this.getToken();
  }
};

// Exportem l'authService per defecte
export default authService;

// Exportem l'api fake per si la uses en altres fitxers (import { api } from ...)
export { api };