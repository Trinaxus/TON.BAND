"use client";

import React, { useState, useEffect } from "react";
import GalleryAuthGate from "./GalleryAuthGate";

interface GalleryWrapperProps {
  children: React.ReactNode;
  galleryName: string | null;
  isAuthenticated: boolean;
}

/**
 * Eine Wrapper-Komponente, die eine Galerie mit Passwortschutz umhüllt.
 * Diese Komponente prüft, ob eine Galerie passwortgeschützt ist und zeigt
 * gegebenenfalls die GalleryAuthGate-Komponente an.
 */
export default function GalleryWrapper({
  children,
  galleryName,
  isAuthenticated
}: GalleryWrapperProps) {
  const [accessType, setAccessType] = useState<'public' | 'password' | 'internal'>('public');
  const [isChecking, setIsChecking] = useState(true);

  // Prüfe den Zugriffstyp der Galerie
  useEffect(() => {
    if (!galleryName) {
      setIsChecking(false);
      return;
    }

    // Prüfe, ob bereits ein Token für diese Galerie im Session Storage vorhanden ist
    const storedToken = sessionStorage.getItem(`gallery_token_${galleryName}`);
    if (storedToken) {
      console.log("Bereits authentifiziert für Galerie:", galleryName);
      setAccessType('public'); // Behandle wie öffentlich, wenn bereits authentifiziert
      setIsChecking(false);
      return;
    }

    // Prüfe den Zugriffstyp der Galerie
    const checkGalleryAccess = async () => {
      try {
        const response = await fetch("/api/verify-gallery-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gallery: galleryName,
            password: "", // Leeres Passwort, um nur den Zugriffstyp zu prüfen
          }),
        });

        const data = await response.json();
        
        if (data.accessType) {
          // Setze den Zugriffstyp basierend auf der API-Antwort
          console.log(`Galerie Zugriffstyp: ${data.accessType}`, galleryName);
          setAccessType(data.accessType as 'public' | 'password' | 'internal');
        } else if (data.passwordProtected) {
          // Abwärtskompatibilität mit altem Format
          console.log("Galerie ist passwortgeschützt (altes Format):", galleryName);
          setAccessType('password');
        } else {
          // Standardmäßig öffentlich
          console.log("Galerie ist öffentlich:", galleryName);
          setAccessType('public');
        }
      } catch (error) {
        console.error("Fehler beim Prüfen des Galeriezugriffs:", error);
        // Im Fehlerfall: Zeige die Galerie an (Fallback)
        setAccessType('public');
      } finally {
        setIsChecking(false);
      }
    };

    checkGalleryAccess();
  }, [galleryName]);

  // Zeige Ladeindikator während der Prüfung
  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#00e1ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Zugriffslogik basierend auf dem Zugriffstyp
  switch (accessType) {
    case 'public':
      // Öffentliche Galerien sind für alle sichtbar
      return <>{children}</>;

    case 'password':
      // Passwortgeschützte Galerien erfordern ein Passwort
      return (
        <GalleryAuthGate galleryName={galleryName || ''} accessType="password">
          {children}
        </GalleryAuthGate>
      );

    case 'internal':
      // Interne Galerien sind nur für angemeldete Benutzer sichtbar
      if (!isAuthenticated) {
        return (
          <GalleryAuthGate galleryName={galleryName || ''} accessType="internal">
            {children}
          </GalleryAuthGate>
        );
      }
      return <>{children}</>;

    default:
      // Standardmäßig öffentlich
      return <>{children}</>;
  }
}

// Hilfsfunktion: Prüfe, ob eine Galerie passwortgeschützt ist
export async function isGalleryPasswordProtected(galleryName: string): Promise<boolean> {
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
    return data.passwordProtected === true;
  } catch (error) {
    console.error("Fehler beim Prüfen des Passwortschutzes:", error);
    return false; // Im Fehlerfall: Gehe davon aus, dass die Galerie nicht passwortgeschützt ist
  }
}
