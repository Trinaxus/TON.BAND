import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Daten aus dem Request-Body lesen
    const data = await request.json();
    const { galleryName } = data;
    
    if (!galleryName) {
      return NextResponse.json({ error: 'Kein Galeriename angegeben' }, { status: 400 });
    }
    
    console.log(`API-Route: Lösche Galerie '${galleryName}'...`);
    
    // Extrahiere Jahr und Galeriename
    const [year, gallery] = galleryName.split('/');
    if (!year || !gallery) {
      return NextResponse.json({ error: 'Ungültiger Galeriename' }, { status: 400 });
    }
    
    // Sende Anfrage an die tonband-API zum Löschen der Galerie
    const res = await fetch('https://tonbandleipzig.de/tonband/api/delete_gallery.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || 'mysecrettoken'
      },
      body: JSON.stringify({ year, gallery })
    });
    
    // Lese die Antwort
    const responseText = await res.text();
    console.log(`API-Antwort Status: ${res.status}, Text: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { rawResponse: responseText };
    }
    
    if (!res.ok) {
      console.error(`Fehler beim Löschen der Galerie: ${res.status}`, responseData);
      return NextResponse.json({ 
        error: `Fehler beim Löschen der Galerie: ${res.status}`,
        details: responseData
      }, { status: res.status });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Galerie '${galleryName}' erfolgreich gelöscht`,
      response: responseData
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Galerie:', error);
    return NextResponse.json({ 
      error: 'Konnte Galerie nicht löschen', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
