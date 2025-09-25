# Galerie-Styles und Struktur

Dieses Dokument erklärt die Struktur der Galerie-Komponenten und die verwendeten Styles im TON.BAND-Projekt.

## Übersicht

Die Galerie besteht aus zwei Hauptansichten:
1. **Galerie-Übersicht**: Zeigt alle verfügbaren Galerien als Karten an
2. **Galerie-Detailansicht**: Zeigt die Bilder/Videos einer ausgewählten Galerie an

## Dateien und Pfade

### Hauptkomponenten

- **Galerie-Hauptkomponente**: `/src/app/gallery/page.tsx`
  - Enthält sowohl die Übersicht als auch die Detailansicht
  - Verwendet React-States, um zwischen den Ansichten zu wechseln

### CSS-Dateien

- **Modul-spezifische Styles**: `/src/app/gallery/gallery.module.css`
  - Enthält alle spezifischen Styles für die Galerie-Komponenten
  - Wird als CSS-Modul importiert (`import styles from "./gallery.module.css"`)

- **Globale Styles**: `/src/app/globals.css`
  - Enthält globale Styles wie Farben, Typografie und grundlegende Layouts
  - Wird in der Root-Layout-Komponente importiert

- **Galerie-spezifische globale Styles**: `/src/app/globals-gallery.css`
  - Enthält globale Styles speziell für die Galerie
  - Wird direkt in der Galerie-Komponente importiert

- **Titel-Styles**: `/src/app/gallery/orange-title.css`
  - Enthält spezifische Styles für die orangefarbenen Überschriften
  - Wird direkt in der Galerie-Komponente importiert

## Galerie-Übersicht

Die Galerie-Übersicht zeigt alle verfügbaren Galerien als Karten an.

### Komponenten-Struktur

```jsx
<div className={styles.galleryGrid}>
  {/* Für jede Galerie */}
  <motion.div className={styles.galleryCard}>
    <div className={styles.imageContainer}>
      <Image ... />
      {/* Video-Indikator, falls es sich um eine Video-Galerie handelt */}
      <div className={styles.categoryTag}>🎥 VIDEO</div>
    </div>
    <div className={styles.captionContainer}>
      <h3 className={styles.title}>{displayName}</h3>
      <div className={styles.captionDetails}>
        <span className={styles.subtitle}>{year}</span>
        {/* Zugriffstyp-Indikator */}
      </div>
    </div>
  </motion.div>
</div>
```

### Verwendete Styles

- **Container**: `.galleryGrid` - Grid-Layout für die Galerie-Karten
- **Karte**: `.galleryCard` - Styling für die einzelnen Galerie-Karten
  - Hintergrund, Rahmen, Schatten, Hover-Effekte
- **Bild-Container**: `.imageContainer` - Container für das Galerie-Vorschaubild
- **Kategorie-Tag**: `.categoryTag` - Styling für den Video-Indikator
- **Bildunterschrift**: `.captionContainer`, `.captionDetails` - Container für Titel und Details
- **Titel**: `.title` - Styling für den Galerie-Titel
- **Untertitel**: `.subtitle` - Styling für das Jahr und andere Metadaten

## Galerie-Detailansicht

Die Detailansicht zeigt die Bilder/Videos einer ausgewählten Galerie an.

### Komponenten-Struktur

```jsx
<div>
  <div className={styles.galleryHeader}>
    <button className={styles.backButton} onClick={handleBackClick}>
      ← Zurück zur Übersicht
    </button>
    <h1 className={styles.galleryTitle}>
      <span>{selectedGallery.split("/")[1] || selectedGallery}</span>
    </h1>
    <p className={styles.gallerySubtitle}>{year}</p>
  </div>
  
  <div className={styles.detailGrid}>
    {/* Für jedes Bild/Video */}
    <div className={styles.imageCard}>
      <div className={styles.imageContainer}>
        <Image ... />
        {/* Video-Indikator, falls es sich um ein Video handelt */}
        {isVideo && <div className={styles.videoIndicator}>VIDEO</div>}
      </div>
      {/* Optional: Bildunterschrift */}
    </div>
  </div>
</div>
```

### Verwendete Styles

- **Header**: `.galleryHeader` - Styling für den Kopfbereich mit Titel und Zurück-Button
- **Zurück-Button**: `.backButton` - Styling für den Zurück-Button
- **Titel**: `.galleryTitle` - Styling für den Galerie-Titel (mit orangefarbener Hervorhebung)
- **Untertitel**: `.gallerySubtitle` - Styling für den Untertitel (Jahr)
- **Grid**: `.detailGrid` - Grid-Layout für die Bilder/Videos
- **Bild-Karte**: `.imageCard` - Styling für die einzelnen Bild-/Video-Karten
- **Bild-Container**: `.imageContainer` - Container für das Bild/Video
- **Video-Indikator**: `.videoIndicator` - Styling für den Video-Indikator

## Filter-Komponenten

Die Galerie-Übersicht enthält Filter-Buttons, um die Galerien nach Kategorien zu filtern.

### Komponenten-Struktur

```jsx
<div className={styles.categories}>
  <button
    className={`${styles.categoryButton} ${activeCategory === 'all' ? styles.active : ''}`}
    onClick={() => handleCategoryClick('all')}
  >
    Alle
  </button>
  {/* Weitere Kategorie-Buttons */}
</div>
```

### Verwendete Styles

- **Filter-Container**: `.categories` - Container für die Filter-Buttons
- **Filter-Button**: `.categoryButton` - Styling für die Filter-Buttons
- **Aktiver Button**: `.categoryButton.active` - Styling für den aktiven Filter-Button

## CSS-Variablen

Die Styles verwenden CSS-Variablen aus der globals.css-Datei:

- **Primärfarben**: `--color-primary-*` (von 50 bis 900)
  - Cyan-Töne, z.B. `--color-primary-500: #00E1FF`
- **Sekundärfarben**: `--color-secondary-*` (von 50 bis 900)
  - Magenta-Töne, z.B. `--color-secondary-500: #E10091`
- **Neutrale Farben**: `--color-neutral-*` (von 50 bis 900)
  - Grautöne, z.B. `--color-neutral-800: #2d2d2d`

Diese Variablen werden für Farben, Rahmen, Schatten und andere visuelle Elemente verwendet.
