import { NextRequest, NextResponse } from "next/server";

// Simuliere eine Datenbank mit einem Array
let portfolioItems: any[] = [
  {
    id: 1,
    gallery: "Galerie 2023",
    url: "https://tonbandleipzig.de/tonband/galleries/2023",
    category: "Event",
    year: "2023"
  },
  {
    id: 2,
    gallery: "Konzert 2022",
    url: "https://tonbandleipzig.de/tonband/galleries/konzert-2022",
    category: "Konzert",
    year: "2022"
  },
  {
    id: 3,
    gallery: "Workshop 2023",
    url: "https://tonbandleipzig.de/tonband/galleries/workshop-2023",
    category: "Workshop",
    year: "2023"
  }
];

export async function POST(req: NextRequest) {
  try {
    console.log("Portfolio Add API aufgerufen");
    
    // Daten aus dem Request-Body lesen
    const { gallery, url, category, year } = await req.json();
    
    // Validierung
    if (!gallery || !url) {
      return NextResponse.json({ error: "Titel (gallery) und URL sind Pflichtfelder" }, { status: 400 });
    }
    
    // URL validieren
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json({ error: "Ungültige URL" }, { status: 400 });
    }
    
    // Neuen Eintrag erstellen
    const newItem = {
      id: portfolioItems.length > 0 ? Math.max(...portfolioItems.map(item => item.id)) + 1 : 1,
      gallery,
      url,
      category: category || "",
      year: year || ""
    };
    
    // Eintrag zur "Datenbank" hinzufügen
    portfolioItems.push(newItem);
    
    console.log("Portfolio-Eintrag erfolgreich erstellt:", newItem);
    
    // Erfolgreiche Antwort zurückgeben
    return NextResponse.json({ 
      success: true,
      message: "Portfolio-Eintrag erfolgreich erstellt",
      item: newItem
    });
    
  } catch (error) {
    console.error("Portfolio Add API Fehler:", error);
    return NextResponse.json({ 
      error: `Server-Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
    }, { status: 500 });
  }
}
