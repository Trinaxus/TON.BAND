import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // 1. Lade alle Galerien von der Galerie-API
    const galleriesResponse = await fetch(`${req.nextUrl.origin}/api/galleries`);
    if (!galleriesResponse.ok) {
      throw new Error(`Fehler beim Laden der Galerien: ${await galleriesResponse.text()}`);
    }
    
    const galleriesData = await galleriesResponse.json();
    const galleries = galleriesData.galleries || {};
    const galleryNames = Object.keys(galleries);
    
    if (!galleryNames.length) {
      return NextResponse.json({ 
        success: false, 
        message: 'Keine Galerien gefunden' 
      }, { status: 404 });
    }
    
    // 2. Für jede Galerie, synchronisiere die Metadaten
    const results = [];
    const errors = [];
    
    for (const galleryName of galleryNames) {
      const images = galleries[galleryName] || [];
      
      if (!images.length) {
        errors.push({ galleryName, error: 'Keine Bilder gefunden' });
        continue;
      }
      
      // Extrahiere Kategorie basierend auf Galerienamen
      let category = extractCategoryFromName(galleryName);
      
      // Extrahiere Jahr aus dem Galerienamen
      let year = extractYearFromGalleryName(galleryName);
      
      // Verwende das erste Bild als URL
      let firstImage = images[0];
      
      // Stelle sicher, dass es eine absolute URL ist
      if (!firstImage.startsWith('http://') && !firstImage.startsWith('https://')) {
        firstImage = `https://${firstImage}`;
      }
      
      // Validiere die URL
      try {
        new URL(firstImage);
      } catch (error) {
        errors.push({ galleryName, error: 'Ungültige Bild-URL' });
        continue;
      }
      
      try {
        // Baserow-Konfiguration
        const baserowToken = process.env.BASEROW_TOKEN;
        const baserowApiUrl = process.env.BASEROW_API_URL || 'https://br.tonbandleipzig.de/api';
        const portfolioTableId = process.env.BASEROW_PORTFOLIO_TABLE_ID || 668;
        
        // Prüfe, ob der Eintrag bereits existiert
        const checkResponse = await fetch(
          `${baserowApiUrl}/database/rows/table/${portfolioTableId}/?user_field_names=true&search=${encodeURIComponent(galleryName)}`,
          {
            headers: {
              'Authorization': `Token ${baserowToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const checkData = await checkResponse.json();
        const existingEntry = checkData.results.find((entry: any) => entry.gallery === galleryName);
        
        if (existingEntry) {
          // Aktualisiere den bestehenden Eintrag
          const updateResponse = await fetch(
            `${baserowApiUrl}/database/rows/table/${portfolioTableId}/${existingEntry.id}/?user_field_names=true`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Token ${baserowToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                gallery: galleryName,
                url: firstImage,
                category: category,
                year: year
              })
            }
          );
          
          if (!updateResponse.ok) {
            throw new Error(`Fehler beim Aktualisieren des Eintrags: ${await updateResponse.text()}`);
          }
          
          results.push({ 
            galleryName, 
            action: 'update', 
            entry: await updateResponse.json() 
          });
        } else {
          // Erstelle einen neuen Eintrag
          const createResponse = await fetch(
            `${baserowApiUrl}/database/rows/table/${portfolioTableId}/?user_field_names=true`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Token ${baserowToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                gallery: galleryName,
                url: firstImage,
                category: category,
                year: year
              })
            }
          );
          
          if (!createResponse.ok) {
            throw new Error(`Fehler beim Erstellen des Eintrags: ${await createResponse.text()}`);
          }
          
          results.push({ 
            galleryName, 
            action: 'create', 
            entry: await createResponse.json() 
          });
        }
      } catch (error) {
        console.error(`Fehler bei der Synchronisierung von ${galleryName}:`, error);
        errors.push({ galleryName, error: error instanceof Error ? error.message : String(error) });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${results.length} Galerien synchronisiert, ${errors.length} Fehler`, 
      results,
      errors
    });
  } catch (error) {
    console.error('Fehler bei der Synchronisierung aller Galerien:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fehler bei der Synchronisierung aller Galerien',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Hilfsfunktion zum Extrahieren des Jahres aus dem Galerienamen
function extractYearFromGalleryName(galleryName: string): string {
  // Versuche, ein vierstelliges Jahr zu finden
  const yearMatch = galleryName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    return yearMatch[0];
  }
  
  // Wenn der Galeriename das Format "Jahr/Unterordner" hat
  if (galleryName.includes('/')) {
    const parts = galleryName.split('/');
    if (parts.length >= 1 && /^\d{4}$/.test(parts[0])) {
      return parts[0];
    }
  }
  
  // Fallback: Aktuelles Jahr
  return new Date().getFullYear().toString();
}

// Hilfsfunktion zum Extrahieren der Kategorie aus dem Galerienamen
function extractCategoryFromName(galleryName: string): string {
  const galleryNameLower = galleryName.toLowerCase();
  
  // Extrahiere Kategorie basierend auf Schlüsselwörtern
  if (galleryNameLower.includes('portrait') || galleryNameLower.includes('shooting')) {
    return "Portrait";
  } else if (galleryNameLower.includes('landschaft') || galleryNameLower.includes('natur')) {
    return "Landschaft";
  } else if (galleryNameLower.includes('architektur') || galleryNameLower.includes('gebäude')) {
    return "Architektur";
  } else if (galleryNameLower.includes('event') || galleryNameLower.includes('veranstaltung')) {
    return "Event";
  } else if (galleryNameLower.includes('kunst') || galleryNameLower.includes('art')) {
    return "Kunst";
  } else if (galleryNameLower.includes('reise') || galleryNameLower.includes('italien') || galleryNameLower.includes('urlaub')) {
    return "Reise";
  }
  
  // Extrahiere aus Teilen des Namens
  if (galleryName.includes(' - ')) {
    const parts = galleryName.split(' - ');
    if (parts.length >= 2) {
      // Nehme den Teil nach dem ersten " - "
      return parts[1];
    }
  }
  
  // Fallback
  return "Sonstiges";
}
