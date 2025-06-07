// Endpoint configuration for tracker

const ENV = 'production';
// const ENV = 'local';


const ENDPOINTS = {
  production: {
    TRACK: 'https://backend.webmeter.in/api/data/track',
    VERIFY: 'https://backend.webmeter.in/api/script/verify-script',
    GEO: 'https://ipapi.co/json/',
  },
  local: {
    TRACK: 'http://localhost:3000/api/data/track',
    VERIFY: 'http://localhost:3000/api/script/verify-script',
    GEO: 'https://ipapi.co/json/',
  },
};

const API_ENDPOINTS = ENDPOINTS[ENV] || ENDPOINTS.production;

export const API = API_ENDPOINTS;
