/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfiguriere Turbopack direkt auf Root-Ebene
  turbopack: {
    // Turbopack-Optionen hier konfigurieren
    resolveAlias: {
      // Alias-Konfigurationen
    }
    // Turbopack hat eine andere Konfigurationsstruktur als Webpack
    // und unterstützt nicht alle gleichen Optionen
  },
  // Weitere experimentelle Funktionen können hier bleiben
  experimental: {},

  // Optimiere Bilder
  images: {
    unoptimized: true,
  },
  // Ignoriere bestimmte Fehler beim Build
  onDemandEntries: {
    // Periode, in der eine Seite im Speicher gehalten wird
    maxInactiveAge: 25 * 1000,
    // Anzahl der Seiten, die im Speicher gehalten werden
    pagesBufferLength: 2,
  },
  // Definiere gültige Seitenerweiterungen
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Deaktiviere strenge Modus-Prüfungen für den Build
  reactStrictMode: false,
  // Wir können die Webpack-Konfiguration beibehalten für Fälle, in denen Webpack verwendet wird
  // aber wir markieren sie als optional, damit Turbopack nicht darüber stolpert
  webpack: process.env.TURBOPACK === '1' ? undefined : (config, { isServer }) => {
    // Ignoriere Warnungen zu großen Dateien
    config.performance = {
      ...config.performance,
      hints: false,
    };
    
    // Wir haben DOM-abhängige Module entfernt, daher ist keine spezielle Konfiguration mehr notwendig
    
    return config;
  },
  // Deaktiviere die Generierung der favicon.ico-Seite
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon',
      },
    ];
  },
  // Ignoriere bestimmte Seiten beim Build
  typescript: {
    // Ignoriere TypeScript-Fehler beim Build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoriere ESLint-Fehler beim Build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
