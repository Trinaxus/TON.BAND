"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  sizes?: string;
  isAuthenticated: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Komponente für Galerie-Bilder mit Blur-Effekt für nicht angemeldete Benutzer
 */
export default function GalleryImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  objectFit = 'cover',
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  isAuthenticated,
  onClick,
  style,
  onError
}: GalleryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Fehler beim Laden des Bildes:', src);
    // Fallback-Bild setzen
    setImgSrc('/placeholder.jpg');
    
    // Wenn eine onError-Funktion übergeben wurde, rufe sie auf
    if (onError) {
      onError(e);
    }
  };
  return (
    <div 
      className="gallery-image-container"
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            style={{ 
              objectFit: objectFit,
              filter: isAuthenticated ? 'none' : 'blur(20px)',
              transform: isAuthenticated ? 'none' : 'scale(1.1)',
              transition: 'filter 0.3s ease, transform 0.3s ease'
            }}
            sizes={sizes}
            priority={priority}
          />
        ) : (
          <Image
            src={imgSrc}
            alt={alt}
            width={width || 800}
            height={height || 600}
            onError={handleError}
            style={{ 
              objectFit: objectFit,
              filter: isAuthenticated ? 'none' : 'blur(20px)',
              transform: isAuthenticated ? 'none' : 'scale(1.1)',
              transition: 'filter 0.3s ease, transform 0.3s ease'
            }}
            sizes={sizes}
            priority={priority}
          />
        )}
      </div>
      
      {!isAuthenticated && (
        <div className="login-overlay">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Exklusiver Inhalt</h3>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>Melde dich an, um dieses Bild in voller Qualität zu sehen.</p>
          <Link href="/login">
            <button className="login-button">Jetzt anmelden</button>
          </Link>
        </div>
      )}
    </div>
  );
}
