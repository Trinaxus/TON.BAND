import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '../../config/api';

export async function GET(request: NextRequest) {
  // URL-Parameter auslesen
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('is_admin') === 'true';
  console.log('API-Route: Lade Galerien von tonband...');
  
  try {
    // Versuche, die Daten von der tonband-API zu laden
    // Füge is_admin=true hinzu, wenn der Parameter in der Anfrage vorhanden ist
    const apiUrl = isAdmin
      ? `${API_ENDPOINTS.GALLERIES}?include_videos=true&is_admin=true`
      : `${API_ENDPOINTS.GALLERIES}?include_videos=true`;
    
    console.log('Lade Galerien von:', apiUrl, isAdmin ? '(Admin-Modus)' : '');
    
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log('API-Antwort Status:', res.status);
    
    if (!res.ok) {
      console.log(`Fehler beim Laden der Galerien vom Server: ${res.status}`);
      return NextResponse.json({ 
        error: `API-Fehler: ${res.status}`,
        galleries: {},
        metadata: {}
      }, { status: res.status });
    }
    
    try {
      const text = await res.text();
      console.log('API-Antwort Text (ersten 100 Zeichen):', text.substring(0, 100));
      
      const data = JSON.parse(text);
      console.log('Galerien geladen:', data.galleries ? Object.keys(data.galleries).length : 0);
      
      // Prüfe, ob die Daten im erwarteten Format sind
      if (data.galleries && Object.keys(data.galleries).length > 0) {
        // Metadaten für jede Galerie abrufen
        const galleryNames = Object.keys(data.galleries);
        const metadataPromises = galleryNames.map(async (galleryName) => {
          try {
            const [year, gallery] = galleryName.split('/');
            if (!year || !gallery) return null;
            
            // Verwende API_ENDPOINTS.GALLERY_META und gib den is_admin-Parameter weiter, wenn vorhanden
            const metaUrl = isAdmin
              ? `${API_ENDPOINTS.GALLERY_META}?year=${encodeURIComponent(year)}&gallery=${encodeURIComponent(gallery)}&is_admin=true`
              : `${API_ENDPOINTS.GALLERY_META}?year=${encodeURIComponent(year)}&gallery=${encodeURIComponent(gallery)}`;
            
            console.log('Lade Metadaten von:', metaUrl, isAdmin ? '(Admin-Modus)' : '');
            
            const metaRes = await fetch(metaUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              },
              cache: 'no-store',
              next: { revalidate: 0 }
            });
            
            if (!metaRes.ok) {
              // Wenn Metadaten nicht geladen werden können, erstelle Standard-Metadaten
              return { 
                galleryName, 
                metadata: {
                  "jahr": year,
                  "galerie": gallery,
                  "kategorie": gallery.includes("VIDEO") ? "Video" : "Session",
                  "tags": ["tonband"]
                }
              };
            }
            
            return { galleryName, metadata: await metaRes.json() };
          } catch (error) {
            console.error(`Fehler beim Laden der Metadaten für ${galleryName}:`, error);
            // Bei Fehler Standard-Metadaten zurückgeben
            const [year, gallery] = galleryName.split('/');
            return { 
              galleryName, 
              metadata: {
                "jahr": year || "2025",
                "galerie": gallery || galleryName,
                "kategorie": gallery?.includes("VIDEO") ? "Video" : "Session",
                "tags": ["tonband"]
              }
            };
          }
        });
        
        // Warte auf alle Metadaten-Anfragen
        const metadataResults = await Promise.all(metadataPromises);
        
        // Erstelle ein Objekt mit den Metadaten
        const metadata: Record<string, any> = {};
        metadataResults.forEach(result => {
          if (result) {
            metadata[result.galleryName] = result.metadata;
          }
        });
        
        // Stelle sicher, dass alle Dateitypen (auch Videos) in den Galerien enthalten sind
        const processedGalleries: Record<string, string[]> = {};
        
        Object.entries(data.galleries).forEach(([galleryName, files]) => {
          if (Array.isArray(files)) {
            // Stelle sicher, dass alle Dateien korrekt verarbeitet werden
            processedGalleries[galleryName] = files.map((file: string) => {
              // Normalisiere die URL, falls nötig
              return file.trim();
            });
          } else {
            processedGalleries[galleryName] = [];
          }
          
          // Debugging-Ausgabe für alle gefundenen Dateien
          console.log(`Galerie ${galleryName}: ${processedGalleries[galleryName].length} Dateien gefunden`);
        });
        
        return NextResponse.json({
          galleries: processedGalleries,
          metadata
        });
      } else {
        console.log('Keine Galerien gefunden');
        return NextResponse.json({ 
          galleries: {},
          metadata: {}
        }, { status: 404 });
      }
    } catch (parseError) {
      console.error('Fehler beim Parsen der JSON-Antwort:', parseError);
      return NextResponse.json({ 
        error: 'Fehler beim Parsen der API-Antwort',
        galleries: {},
        metadata: {}
      }, { status: 500 });
    }
  } catch (fetchError) {
    console.error('Fehler beim Abrufen der Galerien:', fetchError);
    return NextResponse.json({ 
      error: 'Fehler beim Abrufen der Galerien',
      galleries: {},
      metadata: {}
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Hole den Galerienamen aus der URL
    const url = new URL(request.url);
    const galleryName = url.searchParams.get('name');
    
    if (!galleryName) {
      return NextResponse.json({ error: 'Kein Galeriename angegeben' }, { status: 400 });
    }
    
    console.log(`API-Route: Lösche Galerie '${galleryName}'...`);
    
    // Extrahiere Jahr und Galeriename
    const [year, gallery] = galleryName.split('/');
    if (!year || !gallery) {
      return NextResponse.json({ error: 'Ungültiger Galeriename' }, { status: 400 });
    }
    
    // Sende Anfrage an die TONBAND-API zum Löschen der Galerie
    const res = await fetch('https://tonbandleipzig.de/tonband/api/delete_gallery.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || '0000'
      },
      body: JSON.stringify({ year, gallery })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Fehler beim Löschen der Galerie: ${res.status}`, errorText);
      return NextResponse.json({ 
        error: `Fehler beim Löschen der Galerie: ${res.status}`,
        details: errorText
      }, { status: res.status });
    }
    
    return NextResponse.json({ success: true, message: `Galerie '${galleryName}' erfolgreich gelöscht` });
  } catch (error) {
    console.error('Fehler beim Löschen der Galerie:', error);
    return NextResponse.json({ 
      error: 'Konnte Galerie nicht löschen', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
