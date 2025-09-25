import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Upload-Route für Bilder und Videos
 * Diese Route leitet die Anfrage direkt an die PHP-API weiter
 */
export async function POST(request: NextRequest) {
  // CORS-Header für die Antwort setzen
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-TOKEN');
  
  try {
    // Direktes Weiterleiten der Anfrage an die PHP-API
    const uploadUrl = API_ENDPOINTS.UPLOAD;
    console.log('Upload URL:', uploadUrl);
    
    // Hole die FormData aus der Anfrage
    const formData = await request.formData();
    
    // Debug: Überprüfe, welche Felder in der FormData enthalten sind
    const formDataFields = Array.from(formData.keys());
    console.log('FormData Felder:', formDataFields);
    
    // Stelle sicher, dass das 'file'-Feld vorhanden ist
    const file = formData.get('file');
    if (!file) {
      console.error('Kein Datei-Feld in der FormData gefunden');
      return NextResponse.json(
        { success: false, error: 'Keine Datei im Request gefunden' },
        { status: 400, headers }
      );
    }
    
    // Stelle sicher, dass die erforderlichen Felder vorhanden sind
    if (!formData.get('year')) {
      formData.append('year', new Date().getFullYear().toString());
    }
    if (!formData.get('gallery')) {
      formData.append('gallery', 'default');
    }
    
    // Erstelle eine neue FormData für die Weiterleitung
    // Dies ist notwendig, da die ursprüngliche FormData möglicherweise nicht korrekt übertragen wird
    const newFormData = new FormData();
    
    // Füge alle Felder aus der ursprünglichen FormData hinzu
    for (const [key, value] of formData.entries()) {
      newFormData.append(key, value);
    }
    
    // Sende die Anfrage direkt an die PHP-API
    // Verwende den API-Token aus der Umgebungsvariablen oder den Fallback-Wert
    const apiToken = process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || '0000';
    
    // Erstelle die Fetch-Anfrage mit den richtigen Headern
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'X-API-TOKEN': apiToken,
      },
      // Wichtig: Keine Content-Type-Header manuell setzen, damit der Browser die Boundary korrekt setzt
      body: newFormData
    });
    
    // Verarbeite die Antwort
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('API-Antwort:', responseText);
    } catch (e) {
      console.error('Fehler beim Lesen der Antwort:', e);
    }
    
    if (!response.ok) {
      console.error('Fehler beim Upload:', response.status, response.statusText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `API-Fehler: ${response.status}`,
          details: responseText || 'Keine Details verfügbar'
        },
        { status: response.status, headers }
      );
    }
    
    // Versuche, die Antwort als JSON zu parsen
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { headers });
    } catch (jsonError) {
      console.error('Fehler beim Parsen der JSON-Antwort:', jsonError);
      
      // Wenn die Antwort kein gültiges JSON ist, aber der Status-Code 200 ist,
      // gehen wir davon aus, dass der Upload erfolgreich war
      if (response.ok) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Upload erfolgreich, aber ungültiges JSON in der Antwort',
            rawResponse: responseText
          },
          { headers }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ungültiges JSON in der API-Antwort',
          rawResponse: responseText
        },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Upload-Fehler:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Interner Serverfehler beim Upload',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500, headers }
    );
  }
}

// OPTIONS-Handler für CORS-Preflight-Anfragen
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-TOKEN');
  
  return new NextResponse(null, {
    status: 204,
    headers
  });
}
