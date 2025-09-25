import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Baserow API Konfiguration
const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://br.tonbandleipzig.de/api";
const BASEROW_USER_TABLE_ID = process.env.BASEROW_USER_TABLE_ID || "669";

// Wir verwenden den BASEROW_ADMIN_TOKEN für Schreiboperationen, da dieser mehr Rechte hat
const BASEROW_TOKEN = process.env.BASEROW_ADMIN_TOKEN || process.env.BASEROW_TOKEN!;
const BASEROW_URL = `${BASEROW_API_URL}/database/rows/table/${BASEROW_USER_TABLE_ID}/`;

// Feldnamen aus der Benutzer-Tabelle (ID: 669)
// Bei user_field_names=true in der API-Anfrage werden die tatsächlichen Feldnamen verwendet
const FIELD_MAP = {
  username: "username", // Tatsächlicher Feldname in der Baserow-Tabelle
  passwort: "passwort", // Tatsächlicher Feldname in der Baserow-Tabelle
  role: "role", // Tatsächlicher Feldname in der Baserow-Tabelle
  email: "e-mail", // Tatsächlicher Feldname in der Baserow-Tabelle
};

// Rolle zu Single-Select-Option-ID mappen
type RoleType = "admin" | "user";
const ROLE_MAP: Record<RoleType, number> = { admin: 2853, user: 2854 };

export async function POST(req: NextRequest) {
  console.log("Register-API aufgerufen");
  try {
    let { username, email, password } = await req.json();
    // Rolle wird immer auf 'user' gesetzt
    const roleId = 2854;
    console.log("Registrierungsanfrage für:", { username, email });
    
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 });
    }

    // Prüfen, ob Username oder E-Mail schon existieren
    console.log("Baserow-URL:", BASEROW_URL);
    console.log("Baserow-Token:", BASEROW_TOKEN ? "Vorhanden" : "Fehlt");
    
    // Prüfe zuerst, ob die E-Mail bereits existiert
    // Wir verwenden einen direkten API-Aufruf ohne Filter, um alle Benutzer zu erhalten und dann manuell zu filtern
    // Dies ist robuster gegen API-Formatänderungen
    console.log("Hole alle Benutzer, um E-Mail zu prüfen...");
    
    const allUsersUrl = `${BASEROW_URL}?user_field_names=true&size=100`;
    console.log("Alle Benutzer URL:", allUsersUrl);
    
    const allUsersRes = await fetch(allUsersUrl, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` },
      cache: "no-store",
    });
    
    if (!allUsersRes.ok) {
      const errText = await allUsersRes.text();
      console.error("Benutzerabfrage Fehler:", errText);
      return NextResponse.json({ error: `Baserow API-Fehler: ${allUsersRes.status} ${errText}` }, { status: 500 });
    }
    
    const allUsersData = await allUsersRes.json();
    console.log(`${allUsersData.count} Benutzer gefunden.`);
    
    // Prüfe manuell, ob die E-Mail bereits existiert
    // Wir normalisieren beide E-Mails zu Kleinbuchstaben für einen fairen Vergleich
    const normalizedEmail = email.toLowerCase();
    const emailExists = allUsersData.results.some((user: any) => {
      const userEmail = user[FIELD_MAP.email]?.toLowerCase() || '';
      return userEmail === normalizedEmail;
    });
    
    console.log("E-Mail existiert bereits?", emailExists);
    
    if (emailExists) {
      return NextResponse.json({ error: "E-Mail-Adresse bereits vergeben" }, { status: 409 });
    }
    
    // Wir haben bereits alle Benutzer abgerufen, also können wir diese Daten wiederverwenden
    // Prüfe manuell, ob der Benutzername bereits existiert
    const normalizedUsername = username.toLowerCase();
    const usernameExists = allUsersData.results.some((user: any) => {
      const userName = user[FIELD_MAP.username]?.toLowerCase() || '';
      return userName === normalizedUsername;
    });
    
    console.log("Benutzername existiert bereits?", usernameExists);
    
    if (usernameExists) {
      return NextResponse.json({ error: "Benutzername bereits vergeben" }, { status: 409 });
    }

    // User anlegen
    console.log("Erstelle neuen Benutzer...");
    
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Passwort gehasht");
    
    // Erstelle Benutzer-Objekt mit den richtigen Feldnamen
    const userData = {
      [FIELD_MAP.username]: username,
      [FIELD_MAP.email]: email,
      [FIELD_MAP.passwort]: hashedPassword,
      [FIELD_MAP.role]: roleId // Immer als ID speichern
    };
    
    console.log("Benutzer-Daten:", userData);
    console.log("Create URL:", `${BASEROW_URL}?user_field_names=true`);
    
    const createRes = await fetch(`${BASEROW_URL}?user_field_names=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${BASEROW_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });
    
    const responseText = await createRes.text();
    console.log("Create Response:", createRes.status, responseText);
    
    if (!createRes.ok) {
      return NextResponse.json({ error: `User konnte nicht angelegt werden: ${createRes.status} ${responseText}` }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    console.error("Register API Fehler:", error);
    return NextResponse.json({ error: `Server-Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` }, { status: 500 });
  }
}
