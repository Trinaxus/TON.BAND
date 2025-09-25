import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Baserow API Konfiguration
const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://api.baserow.io/api";
const BASEROW_USER_TABLE_ID = process.env.BASEROW_USER_TABLE_ID || "669";
const BASEROW_TOKEN = process.env.BASEROW_TOKEN!;
const BASEROW_URL = `${BASEROW_API_URL}/database/rows/table/${BASEROW_USER_TABLE_ID}/`;

// Feldnamen aus der Benutzer-Tabelle
const FIELD_MAP = {
  username: "username",
  password: "passwort",
  role: "role",
  email: "e-mail",
};

// Hilfsfunktion: Prüft, ob der Benutzer angemeldet und ein Admin ist
async function checkAdminAuth(req: NextRequest) {
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
  } catch (error) {
    console.error("Fehler beim Dekodieren der Session-Daten:", error);
    return { isAuthorized: false, error: "Ungültige Session-Daten" };
  }
};

// GET /api/users/[id] - Einzelnen Benutzer abrufen
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prüfen, ob der Benutzer angemeldet und ein Admin ist
    const auth = await checkAdminAuth(req);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const userId = params.id;
    const url = `${BASEROW_URL}${userId}/?user_field_names=true`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
      }
      const errorText = await response.text();
      console.error(`Baserow API-Fehler: ${response.status} ${errorText}`);
      return NextResponse.json({ error: "Fehler beim Abrufen des Benutzers" }, { status: 500 });
    }

    const userData = await response.json();
    
    // Benutzer-Daten transformieren
    const user = {
      id: userData.id,
      username: userData[FIELD_MAP.username],
      email: userData[FIELD_MAP.email],
      role: userData[FIELD_MAP.role],
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// PUT /api/users/[id] - Benutzer aktualisieren
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prüfen, ob der Benutzer angemeldet und ein Admin ist
    const auth = await checkAdminAuth(req);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const { username, email, password, role } = body;

    // Validierung
    if (!username || !email || !role) {
      return NextResponse.json({ error: "Benutzername, E-Mail und Rolle sind erforderlich" }, { status: 400 });
    }

    // Prüfen, ob E-Mail bereits von einem anderen Benutzer verwendet wird
    const checkUrl = `${BASEROW_URL}?user_field_names=true&filter_e-mail__equal=${encodeURIComponent(email)}`;
    const checkResponse = await fetch(checkUrl, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` },
      cache: "no-store",
    });

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text();
      console.error(`Baserow API-Fehler: ${checkResponse.status} ${errorText}`);
      return NextResponse.json({ error: "Fehler bei der E-Mail-Überprüfung" }, { status: 500 });
    }

    const checkData = await checkResponse.json();
    if (checkData.count > 0) {
      // Prüfen, ob die E-Mail dem aktuellen Benutzer gehört
      const existingUser = checkData.results.find((user: any) => user.id.toString() === userId);
      if (!existingUser && checkData.count > 0) {
        return NextResponse.json({ error: "E-Mail wird bereits von einem anderen Benutzer verwendet" }, { status: 400 });
      }
    }

    // Update-Daten vorbereiten
    const updateData: Record<string, any> = {
      [FIELD_MAP.username]: username,
      [FIELD_MAP.email]: email,
      [FIELD_MAP.role]: role,
    };

    // Passwort nur aktualisieren, wenn eines angegeben wurde
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData[FIELD_MAP.password] = hashedPassword;
    }

    // Benutzer in Baserow aktualisieren
    const updateUrl = `${BASEROW_URL}${userId}/?user_field_names=true`;
    const updateResponse = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 404) {
        return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
      }
      const errorText = await updateResponse.text();
      console.error(`Baserow API-Fehler: ${updateResponse.status} ${errorText}`);
      return NextResponse.json({ error: "Fehler beim Aktualisieren des Benutzers" }, { status: 500 });
    }

    const updatedUser = await updateResponse.json();
    return NextResponse.json({
      message: "Benutzer erfolgreich aktualisiert",
      user: {
        id: updatedUser.id,
        username: updatedUser[FIELD_MAP.username],
        email: updatedUser[FIELD_MAP.email],
        role: updatedUser[FIELD_MAP.role],
      },
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Benutzer löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prüfen, ob der Benutzer angemeldet und ein Admin ist
    const auth = await checkAdminAuth(req);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const userId = params.id;
    
    // Prüfen, ob der Benutzer sich selbst löschen möchte
    if (auth.user.id === userId) {
      return NextResponse.json({ error: "Sie können Ihren eigenen Benutzer nicht löschen" }, { status: 400 });
    }

    // Benutzer in Baserow löschen
    const deleteUrl = `${BASEROW_URL}${userId}/`;
    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: { Authorization: `Token ${BASEROW_TOKEN}` },
    });

    if (!deleteResponse.ok) {
      if (deleteResponse.status === 404) {
        return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
      }
      const errorText = await deleteResponse.text();
      console.error(`Baserow API-Fehler: ${deleteResponse.status} ${errorText}`);
      return NextResponse.json({ error: "Fehler beim Löschen des Benutzers" }, { status: 500 });
    }

    return NextResponse.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
