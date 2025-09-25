"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GalleryPasswordCheckProps {
  galleryName: string;
  onAuthenticated: () => void;
  onCancel: () => void;
}

export default function GalleryPasswordCheck({ 
  galleryName, 
  onAuthenticated, 
  onCancel 
}: GalleryPasswordCheckProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);

  // Prüfe beim Laden, ob die Galerie passwortgeschützt ist
  useEffect(() => {
    // Prüfe, ob bereits ein Token für diese Galerie im Session Storage vorhanden ist
    const storedToken = sessionStorage.getItem(`gallery_token_${galleryName}`);
    if (storedToken) {
      console.log("Bereits authentifiziert für Galerie:", galleryName);
      onAuthenticated();
      return;
    }

    // Prüfe, ob die Galerie passwortgeschützt ist
    const checkGalleryProtection = async () => {
      try {
        const response = await fetch("/api/verify-gallery-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gallery: galleryName,
            password: "", // Leeres Passwort, um nur den Schutzstatus zu prüfen
          }),
        });

        const data = await response.json();
        
        if (!data.passwordProtected) {
          // Galerie ist nicht passwortgeschützt
          console.log("Galerie ist nicht passwortgeschützt:", galleryName);
          setIsPasswordProtected(false);
          onAuthenticated(); // Direkt authentifizieren
        } else {
          // Galerie ist passwortgeschützt
          console.log("Galerie ist passwortgeschützt:", galleryName);
          setIsPasswordProtected(true);
        }
      } catch (error) {
        console.error("Fehler beim Prüfen des Passwortschutzes:", error);
        setError("Fehler beim Prüfen des Passwortschutzes. Bitte versuche es später erneut.");
      }
    };

    checkGalleryProtection();
  }, [galleryName, onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Bitte gib ein Passwort ein.");
      return;
    }

    setIsChecking(true);
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
        
        // Speichere das Token im Session Storage
        if (data.galleryToken) {
          sessionStorage.setItem(`gallery_token_${galleryName}`, data.galleryToken);
        }
        
        // Benachrichtige die übergeordnete Komponente
        onAuthenticated();
      } else {
        // Passwort ist falsch
        console.log("Falsches Passwort für Galerie:", galleryName);
        setError("Falsches Passwort. Bitte versuche es erneut.");
      }
    } catch (error) {
      console.error("Fehler bei der Passwortprüfung:", error);
      setError("Fehler bei der Passwortprüfung. Bitte versuche es später erneut.");
    } finally {
      setIsChecking(false);
    }
  };

  // Wenn die Galerie nicht passwortgeschützt ist, zeige nichts an
  if (!isPasswordProtected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#2a1208] p-8 rounded-lg shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-[#ff6b00]">
          Passwortgeschützte Galerie
        </h2>
        
        <p className="text-gray-300 mb-6">
          Diese Galerie ist passwortgeschützt. Bitte gib das Passwort ein, um die Bilder anzuzeigen.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#232429] border border-[#35363b] border-opacity-80 rounded-md text-[#b4b4b4] focus:outline-none focus:border-[#00E1FF] focus:border-opacity-100"
              placeholder="Passwort eingeben"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md text-red-300">
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
            >
              Abbrechen
            </button>
            
            <button
              type="submit"
              disabled={isChecking}
              className={`px-6 py-2 bg-[#ff6b00] hover:bg-[#e05e00] rounded-md text-white font-medium transition-colors ${
                isChecking ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isChecking ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Prüfe...
                </span>
              ) : (
                "Anzeigen"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
