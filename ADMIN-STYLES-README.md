# TONBAND Leipzig - Admin-Bereich Dokumentation

Diese Dokumentation beschreibt das Design und die Styles des Admin-Bereichs der TONBAND Leipzig Anwendung.

## Farbschema

Das Design des Admin-Bereichs verwendet ein konsistentes Farbschema, das in CSS-Variablen definiert ist:

- **Primärfarben**: 
  - `--color-primary-500`: Hauptfarbe für Akzente und wichtige Elemente (ersetzt die vorherige Orange-Farbe #ff6b00)
  - `--color-primary-600`: Dunklere Variante für Hover-Effekte
  - `--color-primary-700`: Noch dunklere Variante für aktive Zustände
  - `--color-primary-100`: Sehr helle Variante für Hintergründe

- **Sekundärfarben**:
  - `--color-secondary-500`: Für Warnungen und Lösch-Aktionen
  - `--color-secondary-600`: Dunklere Variante für Hover-Effekte
  - `--color-secondary-700`: Noch dunklere Variante für aktive Zustände
  - `--color-secondary-100`: Sehr helle Variante für Hintergründe

- **Neutrale Farben**:
  - `--color-neutral-800`: Dunkler Hintergrund
  - `--color-neutral-700`: Etwas hellerer Hintergrund
  - `--color-neutral-600`: Für Ränder und Trennlinien
  - `--color-neutral-500`: Für deaktivierte Elemente
  - `--color-neutral-400`: Für sekundären Text
  - `--color-neutral-300`: Für Hilfstexte
  - `--color-light`: Für Haupttext auf dunklem Hintergrund

## Komponenten und Styles

### Container und Layout

```css
.container {
  display: flex;
  flex-direction: column;
  max-width: 1600px;
  margin: 40px auto;
  padding: 24px;
}

.header {
  margin-bottom: 32px;
}

.title {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-primary-500);
  margin-bottom: 16px;
}
```

### Feedback-Elemente

```css
.feedback {
  margin: 0 auto 24px auto;
  max-width: 1200px;
  padding: 16px;
  border-radius: 8px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.error {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

.success {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}
```

### Galerie-Karten

```css
.galleryCard {
  background: var(--color-neutral-800);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  overflow: hidden;
  transition: background-color 0.2s;
}

.galleryHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}
```

### Vorschaubilder

```css
.imageMini {
  position: relative;
  width: 50px;
  height: 30px;
  border-radius: 0px;
  overflow: hidden;
}

.imageMiniBild {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.videoIndicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0,0,0,0.6);
  border-radius: 3px;
  padding: 1px 3px;
  font-size: 10px;
}
```

### Buttons und Aktionen

```css
.actionButton {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
  font-size: 14px;
}

.editButton {
  background: var(--color-primary-600);
  color: var(--color-light);
}

.deleteButton {
  background: var(--color-secondary-600);
  color: var(--color-light);
}
```

### Formular-Elemente

```css
.formGroup {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.formLabel {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-neutral-400);
}

.formInput {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-neutral-600);
  background: var(--color-neutral-800);
  color: var(--color-light);
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
```

### Dropzone für Uploads

```css
.dropzoneContainer {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dropzone {
  width: 100%;
  padding: 30px 20px;
  border: 3px dashed var(--color-neutral-600);
  border-radius: 12px;
  background: var(--color-neutral-800);
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.dropzoneActive {
  border-color: var(--color-primary-500);
  background: rgba(var(--color-primary-500-rgb), 0.05);
}
```

### Vorschaubilder für Uploads

```css
.previewContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.previewItem {
  position: relative;
  display: inline-block;
}

.previewImage {
  width: 90px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid var(--color-primary-500);
  background: var(--color-neutral-800);
}

.previewDeleteButton {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #b91c1c;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  line-height: 22px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: background-color 0.2s, transform 0.2s;
}
```

### Upload-Button

```css
.uploadButton {
  margin-left: 0;
  padding: 10px 32px;
  font-size: 18px;
  border-radius: 8px;
  background: var(--color-primary-500);
  color: var(--color-light);
  border: none;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background-color 0.2s, transform 0.1s;
}
```

## Responsive Design

Das Design ist responsiv und passt sich verschiedenen Bildschirmgrößen an. Auf kleineren Bildschirmen werden die Elemente gestapelt und die Abstände verringert.

## Best Practices

1. **CSS-Module**: Alle Styles sind in CSS-Modulen definiert, um Namenskonflikte zu vermeiden.
2. **CSS-Variablen**: Farben und andere wiederverwendbare Werte sind als CSS-Variablen definiert.
3. **Keine Inline-Styles**: Alle Styles wurden aus den Komponenten in CSS-Dateien ausgelagert.
4. **Konsistente Benennung**: Die CSS-Klassen folgen einem konsistenten Benennungsschema.
5. **Hover-Effekte**: Interaktive Elemente haben Hover-Effekte für besseres Feedback.
6. **Transitions**: Übergänge verwenden Animationen für ein flüssigeres Erlebnis.

## Komponenten-Struktur

- **Container**: Hauptcontainer für die Seite
- **Header**: Enthält Titel und Benutzerinformationen
- **Feedback**: Zeigt Erfolgs- oder Fehlermeldungen an
- **Galerie-Karten**: Zeigen Galerien mit Vorschaubildern an
- **Formular**: Enthält Eingabefelder für die Metadaten
- **Dropzone**: Bereich zum Hochladen von Dateien
- **Vorschaubilder**: Zeigen hochgeladene Dateien vor dem Upload an
- **Upload-Button**: Startet den Upload-Prozess

## Bekannte Probleme und Lösungen

- **Problem**: Die Dropzone reagiert manchmal nicht auf Drag-and-Drop-Ereignisse.
  **Lösung**: Stelle sicher, dass die Dropzone-Komponente die korrekten Event-Handler hat und dass die CSS-Klassen korrekt angewendet werden.

- **Problem**: Die Vorschaubilder werden nicht korrekt angezeigt.
  **Lösung**: Überprüfe die Bildpfade und stelle sicher, dass die Bilder korrekt geladen werden.

- **Problem**: Der Header liegt unter anderen Elementen aufgrund eines falschen z-index-Werts.
  **Lösung**: Erhöhe den z-index-Wert des Headers, um sicherzustellen, dass er über anderen Elementen liegt.
