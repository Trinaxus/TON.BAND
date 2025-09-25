import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Baserow API Konfiguration
const USE_BASEROW = process.env.USE_BASEROW === "true";
const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://br.tonbandleipzig.de/api";
const BASEROW_USER_TABLE_ID = process.env.BASEROW_USER_TABLE_ID || "669";
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
const BASEROW_URL = `${BASEROW_API_URL}/database/rows/table/${BASEROW_USER_TABLE_ID}/`;

// Feldnamen aus der Benutzer-Tabelle
const FIELD_MAP = {
  username: process.env.BASEROW_FIELD_USERNAME || "field_6078",
  password: process.env.BASEROW_FIELD_PASSWORT || "field_6080",
  role: process.env.BASEROW_FIELD_ROLE || "field_6079",
  email: process.env.BASEROW_FIELD_EMAIL || "field_6081",
};

// Hilfsfunktion: Prüft, ob der Benutzer angemeldet und ein Admin ist
async function checkAdminAuth(req) {
  try {
    // Cookie auslesen
    const sessionCookie = req.cookies.get('tubox_session')?.value;
    
    // Wenn kein Cookie vorhanden ist, ist der Benutzer nicht eingeloggt
    if (!sessionCookie) {
      return { isAuthorized: false, error: "Nicht eingeloggt" };
    }
    
    try {
      // Session-Daten dekodieren
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
      
      // Prüfe, ob die Session-Daten vollständig sind und der Benutzer ein Admin ist
      if (!sessionData.username || !sessionData.email || sessionData.role !== "admin") {
        return { isAuthorized: false, error: "Nicht autorisiert" };
      }
      
      return { isAuthorized: true, user: sessionData };
    } catch (parseError) {
      console.error("Fehler beim Dekodieren der Session-Daten:", parseError);
      return { isAuthorized: false, error: "Ungültige Session-Daten" };
    }
  } catch (error) {
    console.error("Fehler bei der Authentifizierungsprüfung:", error);
    return { isAuthorized: false, error: "Interner Serverfehler bei der Authentifizierung" };
  }
}

// GET: Einen einzelnen Benutzer abrufen
export async function GET(req, { params }) {
  const { id } = params;
  
  // Prüfe, ob der Benutzer ein Admin ist
  const authCheck = await checkAdminAuth(req);
  if (!authCheck.isAuthorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }
  
  try {
    // Benutzer von Baserow abrufen
    const response = await fetch(`${BASEROW_URL}${id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `Fehler beim Abrufen des Benutzers: ${errorData.error || response.statusText}` }, { status: response.status });
    }
    
    const userData = await response.json();
    
    // Benutzer-Objekt formatieren (ohne Passwort)
    const user = {
      id: userData.id,
      username: userData[FIELD_MAP.username],
      email: userData[FIELD_MAP.email],
      role: userData[FIELD_MAP.role]
    };
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// PUT: Einen Benutzer aktualisieren
export async function PUT(req, { params }) {
  const { id } = params;
  
  // Prüfe, ob der Benutzer ein Admin ist
  const authCheck = await checkAdminAuth(req);
  if (!authCheck.isAuthorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }
  
  try {
    // Daten aus dem Request-Body lesen
    const data = await req.json();
    
    // Daten validieren
    if (!data.username || !data.email || !data.role) {
      return NextResponse.json({ error: "Unvollständige Daten" }, { status: 400 });
    }
    
    // Daten für Baserow formatieren
    const baserowData = {
      [FIELD_MAP.username]: data.username,
      [FIELD_MAP.email]: data.email,
      [FIELD_MAP.role]: data.role
    };
    
    // Wenn ein neues Passwort gesetzt werden soll
    if (data.password && data.password.trim() !== "") {
      // Passwort hashen
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      baserowData[FIELD_MAP.password] = hashedPassword;
    }
    
    // Benutzer in Baserow aktualisieren
    const response = await fetch(`${BASEROW_URL}${id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(baserowData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `Fehler beim Aktualisieren des Benutzers: ${errorData.error || response.statusText}` }, { status: response.status });
    }
    
    const updatedUser = await response.json();
    
    // Aktualisiertes Benutzer-Objekt formatieren (ohne Passwort)
    const user = {
      id: updatedUser.id,
      username: updatedUser[FIELD_MAP.username],
      email: updatedUser[FIELD_MAP.email],
      role: updatedUser[FIELD_MAP.role]
    };
    
    return NextResponse.json({ message: "Benutzer erfolgreich aktualisiert", user });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// DELETE: Einen Benutzer löschen
export async function DELETE(req, { params }) {
  const { id } = params;
  
  // Prüfe, ob der Benutzer ein Admin ist
  const authCheck = await checkAdminAuth(req);
  if (!authCheck.isAuthorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }
  
  try {
    // Benutzer in Baserow löschen
    const response = await fetch(`${BASEROW_URL}${id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `Fehler beim Löschen des Benutzers: ${errorData.error || response.statusText}` }, { status: response.status });
    }
    
    return NextResponse.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
