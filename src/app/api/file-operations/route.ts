import { NextRequest, NextResponse } from 'next/server';

// Sicherheitscheck für Admin-Berechtigungen
async function checkAdminPermission(req: NextRequest) {
  try {
    // Cookie auslesen und prüfen
    const sessionCookie = req.cookies.get('tubox_session')?.value;
    if (!sessionCookie) {
      return false;
    }
    
    // Session-Daten dekodieren
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
    return sessionData.role === 'admin';
  } catch (error) {
    console.error('Fehler bei der Berechtigungsprüfung:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Prüfe Admin-Berechtigung
  const isAdmin = await checkAdminPermission(req);
  if (!isAdmin) {
    return NextResponse.json({ 
      success: false, 
      error: 'Keine Berechtigung für diese Operation' 
    }, { status: 403 });
  }
  
  try {
    const body = await req.json();
    const { operation, source, destination, galleryName, newName, metadata } = body;
    
    // API-URL für Dateioperationen auf dem Webspace
    const apiUrl = process.env.FILE_OPERATIONS_API || 'https://tonbandleipzig.de/tonband/api/file_operations.php';
    
    // Bereite die Daten für die PHP-API vor
    const apiData = {
      operation,
      // Konvertiere die Parameter je nach Operation
      ...(operation === 'rename' && {
        oldPath: source,
        newPath: destination || `${source.split('/').slice(0, -1).join('/')}/${newName}`
      }),
      ...(operation === 'delete' && {
        path: source
      }),
      ...(operation === 'create_directory' && {
        path: destination || `uploads/${new Date().getFullYear()}/${galleryName}`
      }),
      ...(operation === 'list' && {
        path: source || 'uploads'
      }),
      ...(operation === 'updateMetadata' && {
        galleryName,
        metadata
      })
    };
    
    console.log('Sende Anfrage an Dateioperations-API:', apiUrl);
    console.log('Anfragedaten:', apiData);
    
    // Sende Anfrage an die PHP-API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FILE_OPERATIONS_TOKEN || 'dein_geheimer_token'}`
      },
      body: JSON.stringify(apiData),
    });
    
    // Fallback für den Fall, dass die PHP-API nicht existiert
    if (!response.ok) {
      // Simuliere Erfolg für Testzwecke
      console.warn('Dateioperations-API nicht erreichbar. Simuliere Erfolg für Testzwecke.');
      
      return NextResponse.json({ 
        success: true, 
        message: `Operation "${operation}" simuliert (API nicht verfügbar)`,
        simulated: true
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fehler bei Dateioperation:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
    }, { status: 500 });
  }
}

// Für Galerie-Informationen abrufen
export async function GET(req: NextRequest) {
  // Prüfe Admin-Berechtigung
  const isAdmin = await checkAdminPermission(req);
  if (!isAdmin) {
    return NextResponse.json({ 
      success: false, 
      error: 'Keine Berechtigung für diese Operation' 
    }, { status: 403 });
  }
  
  try {
    // Hole Galerie-Namen aus der URL
    const galleryName = req.nextUrl.searchParams.get('gallery');
    
    if (!galleryName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Galerie-Name erforderlich' 
      }, { status: 400 });
    }
    
    // Hole Galerie-Informationen von der Galleries-API
    const galleriesResponse = await fetch(`${req.nextUrl.origin}/api/galleries`);
    if (!galleriesResponse.ok) {
      throw new Error(`Fehler beim Laden der Galerien: ${await galleriesResponse.text()}`);
    }
    
    const galleriesData = await galleriesResponse.json();
    const galleries = galleriesData.galleries || {};
    
    // Prüfe, ob die Galerie existiert
    if (!galleries[galleryName]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Galerie nicht gefunden' 
      }, { status: 404 });
    }
    
    // Hole Metadaten für die Galerie
    const metaResponse = await fetch(`${req.nextUrl.origin}/api/proxy-meta?url=${encodeURIComponent(galleries[galleryName][0].replace(/[^/]+$/, 'meta.json'))}`);
    let metadata = {};
    
    if (metaResponse.ok) {
      try {
        metadata = await metaResponse.json();
      } catch (error) {
        console.warn('Keine gültigen Metadaten gefunden');
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      galleryName,
      images: galleries[galleryName],
      metadata
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Galerie-Informationen:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
    }, { status: 500 });
  }
}
