/**
 * API utility for getting the correct backend URL based on environment
 * In development: uses Vite proxy at /api
 * In production: uses VITE_BACKEND_URL directly
 */

export const getApiBaseUrl = () => {
  const isDev = import.meta.env.VITE_NODE_ENV === 'dev';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (isDev) {
    // Development: use Vite proxy
    return '/api';
  }

  // Production: use full backend URL
  return backendUrl;
};

/**
 * Build full API URL
 * @param {string} endpoint - API endpoint (e.g., '/signin', '/getDoctorId')
 * @returns {string} Full API URL
 */
export const buildApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  // Ensure no double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

export default {
  getApiBaseUrl,
  buildApiUrl
};