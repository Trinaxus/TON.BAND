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
    const apiUrl = `${API_ENDPOINTS.SET_GALLERY_PASSWORD}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gallery, password }),
    });

    // Antwort von der PHP-API verarbeiten
    const result = await response.json();

    // Erfolg oder Fehler zurückgeben
    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Passwort erfolgreich gesetzt' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Fehler beim Setzen des Passworts' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Fehler beim Setzen des Passworts:', error);
    return NextResponse.json(
      { success: false, message: 'Serverfehler beim Setzen des Passworts' },
      { status: 500 }
    );
  }
}
