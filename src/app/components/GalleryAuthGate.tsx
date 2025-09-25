"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/gallery-auth.css";

interface GalleryAuthGateProps {
  children: React.ReactNode;
  galleryName: string;
  accessType: 'public' | 'password' | 'internal';
}

export default function GalleryAuthGate({ children, galleryName, accessType }: GalleryAuthGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // Prüfe beim Laden, ob der Benutzer bereits authentifiziert ist
  useEffect(() => {
    if (accessType === 'public') {
      // Öffentliche Galerien sind immer zugänglich
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    // Für passwortgeschützte Galerien: Prüfe, ob bereits ein Token im Session Storage vorhanden ist
    if (accessType === 'password') {
      const storedToken = sessionStorage.getItem(`gallery_token_${galleryName}`);
      if (storedToken) {
        console.log("Bereits authentifiziert für Galerie:", galleryName);
        setIsAuthenticated(true);
      }
    }
    
    // Für interne Galerien: Hier müsste eine Prüfung des Admin-Status erfolgen
    // Da wir das in der GalleryWrapper bereits prüfen, setzen wir hier einfach isAuthenticated auf false
    
    setIsLoading(false);
  }, [galleryName, accessType]);

  // Funktion zum Überprüfen des Passworts
  const verifyPassword = async () => {
    if (!password.trim()) {
      setError("Bitte gib ein Passwort ein.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/verify-gallery-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gallery: galleryName,
          password: password,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Passwort ist korrekt
        console.log("Passwort korrekt für Galerie:", galleryName);
        // Token im Session Storage speichern
        if (data.galleryToken) {
          sessionStorage.setItem(`gallery_token_${galleryName}`, data.galleryToken);
        }
        setIsAuthenticated(true);
      } else {
        // Passwort ist falsch
        console.log("Falsches Passwort für Galerie:", galleryName);
        setError("Falsches Passwort. Bitte versuche es erneut.");
      }
    } catch (error) {
      console.error("Fehler bei der Passwortüberprüfung:", error);
      setError("Fehler bei der Passwortüberprüfung. Bitte versuche es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  // Wenn der Benutzer authentifiziert ist, zeige die Kinder-Komponenten
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Wenn noch geladen wird, zeige einen Ladeindikator
  if (isLoading) {
    return (
      <div className="relative">
        <div className="gallery-auth-blur">
          {children}
        </div>
        <div className="gallery-auth-overlay">
          <div className="p-4 rounded-lg bg-[#2a1208] shadow-lg">
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#00e1ff] border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-white">Lade...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Zeige entsprechende Meldung je nach Zugriffstyp
  return (
    <div className="relative">
      {/* Verwischter Hintergrund der Galerie */}
      <div className="gallery-auth-blur">
        {children}
      </div>
      
      {/* Zugriffsaufforderung basierend auf dem Zugriffstyp */}
      <div className="gallery-auth-overlay">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gallery-auth-form"
        >
          {accessType === 'password' && (
            <>
              {showPasswordInput ? (
                <>
                  <h2 className="gallery-auth-title" style={{ color: '#ff6b00' }}>
                    Passwort eingeben
                  </h2>
                  
                  {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                  )}
                  
                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Passwort"
                      className="w-full p-2 border border-gray-300 rounded"
                      onKeyPress={(e) => e.key === 'Enter' && verifyPassword()}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={verifyPassword}
                      className="gallery-auth-button"
                      style={{ backgroundColor: '#ff6b00' }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Überprüfe...' : 'Bestätigen'}
                    </button>
                    
                    <button
                      onClick={() => setShowPasswordInput(false)}
                      className="gallery-auth-button"
                      style={{ backgroundColor: '#666' }}
                      disabled={isLoading}
                    >
                      Abbrechen
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="gallery-auth-title" style={{ color: '#ff6b00' }}>
                    Passwortgeschützte Galerie
                  </h2>
                  
                  <p className="gallery-auth-description">
                    Diese Galerie ist passwortgeschützt. Bitte gib das Passwort ein, um die Bilder anzuzeigen.
                  </p>
                  
                  <button
                    onClick={() => setShowPasswordInput(true)}
                    className="gallery-auth-button"
                    style={{ backgroundColor: '#ff6b00' }}
                  >
                    Passwort eingeben
                  </button>
                </>
              )}
            </>
          )}
          
          {accessType === 'internal' && (
            <>
              <h2 className="gallery-auth-title" style={{ color: '#ef4444' }}>
                Nur für Administratoren
              </h2>
              
              <p className="gallery-auth-description">
                Diese Galerie ist nur für Administratoren zugänglich. Bitte melde dich mit deinem Admin-Konto an.
              </p>
              
              <a href="/admin" className="gallery-auth-button" style={{ backgroundColor: '#ef4444', textDecoration: 'none', display: 'inline-block' }}>
                Zum Login
              </a>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
