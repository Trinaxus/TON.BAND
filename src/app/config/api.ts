// API-Konfiguration für TONBAND Leipzig
// Diese Datei enthält die Basis-URLs für alle API-Anfragen

// Lokale Entwicklung: Verwende die lokale API
const isLocalDev = process.env.NODE_ENV === 'development';

// Basis-URLs
// Für Entwicklung verwenden wir die Live-API, da die lokale API möglicherweise nicht korrekt konfiguriert ist
export const API_BASE_URL = "https://tonbandleipzig.de/tonband";

// API-Endpunkte
export const API_ENDPOINTS = {
  // Galerien
  GALLERIES: `${API_BASE_URL}/api/galleries.php`,
  GALLERY_META: `${API_BASE_URL}/api/gallery_meta.php`,
  DELETE_GALLERY: `${API_BASE_URL}/api/delete_gallery.php`,
  DELETE_IMAGE: `${API_BASE_URL}/api/delete_image.php`,
  VERIFY_GALLERY_PASSWORD: `${API_BASE_URL}/api/verify-gallery-password.php`,
  SET_GALLERY_PASSWORD: `${API_BASE_URL}/api/set-gallery-password.php`,
  
  // Uploads
  UPLOAD: `${API_BASE_URL}/upload.php`,
  
  // Dateipfade
  UPLOADS_BASE: `${API_BASE_URL}/uploads`,
  
  // Dateioperationen
  FILE_OPERATIONS: `${API_BASE_URL}/api/file_operations.php`,
};

// API-Token
export const API_TOKEN = process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || '0000';

// Export für einfachen Zugriff
export default API_ENDPOINTS;
