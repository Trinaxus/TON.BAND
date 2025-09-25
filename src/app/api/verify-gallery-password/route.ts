import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '../../config/api';

export async function POST(request: NextRequest) {
  try {
    // Daten aus dem Request-Body extrahieren
    const data = await request.json();
    const { gallery, password } = data;

    // Überprüfen, ob alle erforderlichen Daten vorhanden sind
    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie muss angegeben werden' },
        { status: 400 }
      );
    }

    // Anfrage an die PHP-API senden
    const apiUrl = API_ENDPOINTS.VERIFY_GALLERY_PASSWORD;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gallery, password }),
    });

    // Antwort von der PHP-API verarbeiten
    const responseData = await response.json();

    // Antwort an den Client zurückgeben
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Fehler bei der Passwortüberprüfung:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Fehler bei der Passwortüberprüfung',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
