import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../config/api";

// GET: Metadaten einer Galerie abrufen
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = searchParams.get("year");
    const gallery = searchParams.get("gallery");
    const isAdmin = searchParams.get("is_admin") === "true";

    if (!year || !gallery) {
      return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
    }

    // Baue die URL mit dem is_admin-Parameter, wenn vorhanden
    const apiUrl = isAdmin
      ? `${API_ENDPOINTS.GALLERY_META}?year=${encodeURIComponent(year)}&gallery=${encodeURIComponent(gallery)}&is_admin=true`
      : `${API_ENDPOINTS.GALLERY_META}?year=${encodeURIComponent(year)}&gallery=${encodeURIComponent(gallery)}`;
      
    console.log('Lade Galerie-Metadaten von:', apiUrl, isAdmin ? '(Admin-Modus)' : '');
    
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Metadaten" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

// POST: Metadaten einer Galerie aktualisieren
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, gallery, meta } = body;

    if (!year || !gallery || !meta) {
      return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
    }

    const res = await fetch("https://tonbandleipzig.de/tonband/api/gallery_meta.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || "mysecrettoken"
      },
      body: JSON.stringify({ year, gallery, meta }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fehler beim Speichern der Metadaten" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}
