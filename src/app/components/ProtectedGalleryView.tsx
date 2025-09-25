"use client";

import React from "react";
import GalleryAuthGate from "./GalleryAuthGate";

interface ProtectedGalleryViewProps {
  children: React.ReactNode;
  galleryName: string;
  isAuthenticated: boolean;
  accessType: 'public' | 'password' | 'internal';
}

/**
 * Komponente, die eine Galerie-Ansicht mit Passwortschutz umschließt.
 * Berücksichtigt sowohl die globale Benutzerauthentifizierung als auch den Passwortschutz auf Galerie-Ebene.
 */
export default function ProtectedGalleryView({ 
  children, 
  galleryName,
  isAuthenticated,
  accessType
}: ProtectedGalleryViewProps) {
  // Wenn der Benutzer nicht angemeldet ist, zeige die Kinder-Komponenten nicht an
  // (die bestehende AuthGate-Komponente sollte bereits dafür sorgen, dass nicht angemeldete Benutzer
  // zur Login-Seite weitergeleitet werden)
  if (!isAuthenticated) {
    return null;
  }

  // Wenn der Benutzer angemeldet ist, prüfe den Passwortschutz für die spezifische Galerie
  return (
    <GalleryAuthGate galleryName={galleryName} accessType={accessType}>
      {children}
    </GalleryAuthGate>
  );
}
