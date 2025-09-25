# TON.BAND Galerie-Anwendung

Diese [Next.js](https://nextjs.org)-Anwendung dient zur Verwaltung und Anzeige von Fotogalerien für TON.BAND. Sie bietet eine moderne Benutzeroberfläche mit dynamischen Hintergrundeffekten, Benutzerauthentifizierung und Galerieverwaltung.

## Funktionen

- **Galerie-Ansicht**: Durchsuchen und Anzeigen von Fotogalerien mit Kategoriefilter
- **Admin-Bereich**: Verwaltung von Galerien und Bildern (nur für Administratoren)
- **Benutzerauthentifizierung**: Registrierung, Anmeldung und Benutzerverwaltung
- **Dynamischer Hintergrund**: Plexus-Hintergrundeffekt
- **Besucherstatistiken**: Erfassung und Anzeige von Besucherstatistiken
- **Portfolio-Verwaltung**: Verwaltung von Portfolio-Einträgen mit lokaler Datenspeicherung

## Technologien

- **Frontend**: Next.js 15, React, Framer Motion
- **Backend**: Next.js API-Routen, Baserow (für Benutzerdaten), PHP-APIs (für Galerieverwaltung)
- **Authentifizierung**: Cookie-basierte Authentifizierung
- **Styling**: CSS Modules, Inline-Styling, Responsive Design
- **Datenspeicherung**: Lokale JSON-Dateien für Portfolio-Daten, PHP-basierte APIs für Galerie-Daten

## Erste Schritte

### Umgebungsvariablen einrichten

Erstelle eine `.env.local` Datei im Hauptverzeichnis mit folgenden Einstellungen:

```
# Baserow API Konfiguration (für Benutzerverwaltung)
USE_BASEROW=true
BASEROW_TOKEN=dein_baserow_token
BASEROW_USER_TABLE_ID=deine_tabellen_id
BASEROW_DATABASE_ID=deine_datenbank_id
BASEROW_API_URL=https://deine-baserow-instanz.de/api

# Baserow Feldnamen
BASEROW_FIELD_USERNAME=field_id_für_benutzername
BASEROW_FIELD_PASSWORT=field_id_für_passwort
BASEROW_FIELD_ROLE=field_id_für_rolle
BASEROW_FIELD_EMAIL=field_id_für_email

# Dateioperationen
FILE_OPERATIONS_API=https://deine-domain.de/pfad/zur/api/file_operations.php
NEXT_PUBLIC_TONBAND_API_TOKEN=dein_api_token
```

### Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser, um die Anwendung zu sehen.

### Produktions-Build erstellen

```bash
npm run build
```

### Produktionsversion starten

```bash
npm run start
```

## Detaillierte Projektstruktur

```
tubox.de-ton.band-next/
├── public/                      # Statische Dateien
│   ├── tubox_galleries.json     # Lokale Galerie-Daten
│   └── portfolio.json           # Lokale Portfolio-Daten
├── src/
│   ├── app/                     # Hauptanwendungscode (Next.js App Router)
│   │   ├── admin/               # Admin-Bereich
│   │   │   ├── galleries/       # Galerie-Verwaltung
│   │   │   └── page.tsx         # Admin-Hauptseite
│   │   ├── all-images/          # Alle Bilder anzeigen
│   │   ├── api/                 # API-Routen
│   │   │   ├── auth/            # Authentifizierungs-APIs
│   │   │   ├── gallery-meta/    # Galerie-Metadaten-APIs
│   │   │   ├── portfolio/       # Portfolio-APIs
│   │   │   │   ├── add/         # Portfolio-Einträge hinzufügen
│   │   │   │   └── route.ts     # Portfolio-Daten abrufen
│   │   │   ├── sync/            # Synchronisierungs-APIs
│   │   │   └── upload/          # Datei-Upload-APIs
│   │   ├── gallery/             # Galerie-Ansicht
│   │   ├── login/               # Login-Seite
│   │   ├── portfolio/           # Portfolio-Seiten
│   │   ├── upload/              # Upload-Seiten
│   │   ├── globals.css          # Globale Styles
│   │   └── layout.tsx           # Haupt-Layout
│   ├── components/              # Wiederverwendbare Komponenten
│   └── utils/                   # Hilfsfunktionen
├── .env.local                   # Umgebungsvariablen (nicht im Repository)
├── package.json                 # Projekt-Dependencies
└── README.md                    # Diese Datei
```

## API-Verbindungen

Die Anwendung verwendet verschiedene API-Verbindungen für unterschiedliche Funktionen:

### 1. Benutzerauthentifizierung (Baserow)

Die Benutzerauthentifizierung verwendet Baserow als Datenbank. Die Verbindung wird über die API-Routen in `/src/app/api/login/route.ts` und `/src/app/api/register/route.ts` hergestellt. Die Konfiguration erfolgt über die Umgebungsvariablen in `.env.local`.

### 2. Galerie-Verwaltung (PHP-APIs)

Die Galerie-Verwaltung verwendet PHP-APIs, die auf dem Server gehostet werden. Die Verbindung wird über die API-Routen in `/src/app/api/galleries/route.ts`, `/src/app/api/upload/route.ts` und `/src/app/api/delete-gallery/route.ts` hergestellt.

Die PHP-APIs befinden sich im Verzeichnis `Tubox.de/tonband/api/` auf dem Server und umfassen:
- `galleries.php`: Abrufen von Galerie-Daten
- `upload.php`: Hochladen von Bildern
- `delete_gallery.php`: Löschen von Galerien

### 3. Portfolio-Verwaltung (Lokale Datenspeicherung)

Die Portfolio-Verwaltung verwendet lokale JSON-Dateien zur Datenspeicherung. Die Daten werden über die API-Routen in `/src/app/api/portfolio/route.ts` und `/src/app/api/portfolio/add/route.ts` verwaltet.

## Responsive Design

Die Anwendung ist vollständig responsiv und optimiert für:
- Desktop-Computer
- Tablets
- Mobilgeräte

Die responsive Anpassung erfolgt durch:
- Flexible Layouts mit CSS Flexbox und Grid
- Media Queries für gerätespezifische Anpassungen
- Optimierte Eingabefelder für Touch-Geräte
- Angepasste Schriftgrößen und Abstände für verschiedene Bildschirmgrößen

## Externe Abhängigkeiten

- Baserow-API für Datenbankzugriff
- PHP-APIs für Galerie-Metadaten und Bildverwaltung

## Fehlerbehandlung

Die Anwendung enthält robuste Fehlerbehandlung und Fallback-Mechanismen:

- Fallback-Daten für Galerien, wenn die externe API nicht erreichbar ist
- Automatische Wiederverbindung für Benutzerauthentifizierung
- Fehlerbehandlung für Bildladeprozesse

## Änderungsprotokoll

### 04.05.2025

#### Hintergrund verbessert (`src/app/components/ModernBackground.tsx`)
- Haupthintergrundfarbe von dunkelbraun (#1a0500) zu reinem Schwarz (#000000) geändert
- Orangene Akzent-Elemente intensiver gestaltet:
  - Opazität von 0.08 auf 0.2 erhöht
  - Position des unteren Akzent-Elements angepasst (von left: 10% zu left: 5%)
  - Beide Akzent-Elemente haben jetzt die gleiche Intensität (0.2)
- Kontrastreicherer Hintergrund mit deutlicheren orangenen Akzenten
- Geändert in der Komponente, die im Root-Layout eingebunden ist

#### Navigationsleiste verbessert (`src/app/globals.css` und `src/app/components/Header.tsx`)
- Widersprüchliche CSS-Stile in `globals.css` und `Header.tsx` korrigiert
- Einheitlicher Stil für die Navigationsleiste implementiert:
  - Dunkelbraune Hintergrundfarbe (#1a0500)
  - Sehr subtiler orangefarbener Rahmen am unteren Rand (rgba(255, 107, 0, 0.1))
  - Keine Transparenz oder Blur-Effekte mehr
  - Entfernung doppelter Linien im Header-Bereich
- Konsistentes Erscheinungsbild auf allen Seiten der Website sichergestellt
- Geändert in den Komponenten, die in allen Seiten der Website verwendet werden
