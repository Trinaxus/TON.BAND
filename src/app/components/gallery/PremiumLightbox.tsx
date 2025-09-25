'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PremiumLightbox.module.css';

interface PremiumLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  videos: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  galleryName?: string; // Optional Galeriename für bessere Benutzerführung
}

export default function PremiumLightbox({
  isOpen,
  onClose,
  images,
  videos,
  currentIndex,
  onNavigate,
  galleryName
}: PremiumLightboxProps) {
  const allMedia = [...images, ...videos];
  const isVideo = (url: string) => url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  
  // Vereinfachte Lightbox: kein Zoom/Drag
  
  // Touch-Gesten
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  
  // Anzeige: Zähler und Galeriename
  const totalItems = allMedia.length;
  
  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Keine Sprungnavigation nötig
  
  // Tastaturnavigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigateTo(currentIndex - 1);
          break;
        case 'ArrowRight':
          navigateTo(currentIndex + 1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);
  
  // Kein Zoom-Reset nötig
  
  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      onNavigate(totalItems - 1);
    } else if (index >= totalItems) {
      onNavigate(0);
    } else {
      onNavigate(index);
    }
  }, [totalItems, onNavigate]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touchStart.x - touch.clientX;
    
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'left' : 'right');
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleTouchEnd = () => {
    if (swipeDirection === 'left') {
      navigateTo(currentIndex + 1);
    } else if (swipeDirection === 'right') {
      navigateTo(currentIndex - 1);
    }
    setSwipeDirection(null);
  };
  
  // Kein Wheel/DoubleClick-Zoom
  
  const currentUrl = allMedia[currentIndex] || '';
  const currentMediaType = isVideo(currentUrl) ? 'video' : 'image';
  
  // Animationsvarianten
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { 
        duration: 0.2
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div 
            className={styles.lightboxContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            
          >
            <div className={styles.mediaContainer}>
              {currentMediaType === 'image' ? (
                <div className={styles.imageWrapper}>
                  <Image
                    src={currentUrl}
                    alt={`Gallery image ${currentIndex + 1}`}
                    fill
                    className={styles.image}
                    draggable={false}
                    sizes="100vw"
                    priority
                    quality={90}
                  />
                </div>
              ) : (
                <div className={styles.videoWrapper}>
                  <video
                    src={currentUrl}
                    controls
                    autoPlay
                    className={styles.video}
                    playsInline
                  />
                </div>
              )}
            </div>
            
            {/* Steuerelemente */}
            <div className={styles.controls}>
              <button 
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(currentIndex - 1);
                }}
                aria-label="Previous image"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button 
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(currentIndex + 1);
                }}
                aria-label="Next image"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close lightbox"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Minimaler Zähler und Galeriename */}
            <div className={styles.progressContainer}>
              <div className={styles.imageCounterContainer}>
                <div className={styles.imageCounter}>
                  <span className={styles.currentIndex}>{currentIndex + 1}</span>
                  <span className={styles.separator}>/</span>
                  <span className={styles.totalItems}>{totalItems}</span>
                </div>
                {galleryName && (
                  <div className={styles.galleryName}>{galleryName}</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
