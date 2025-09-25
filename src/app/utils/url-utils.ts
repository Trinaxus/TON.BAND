/**
 * Standardisiert URLs auf das tonband-Format
 * @param url Die zu standardisierende URL
 * @returns Die standardisierte URL
 */
export function ensureTonbandUrl(url: string): string {
  // Standardisiere alle URLs auf tonband
  const tonbandBaseUrl = "https://tonbandleipzig.de/tonband/uploads/";
  
  // Extrahiere den Pfad nach /uploads/ aus der URL, falls vorhanden
  if (url && url.includes("/uploads/")) {
    const pathAfterUploads = url.split("/uploads/")[1];
    if (pathAfterUploads) {
      return `${tonbandBaseUrl}${pathAfterUploads}`;
    }
  }
  
  // Wenn keine Anpassung nötig ist, gib die Original-URL zurück
  return url;
}
