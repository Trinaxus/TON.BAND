import { NextRequest, NextResponse } from "next/server";

// Lokale Portfolio-Daten als Fallback
const fallbackPortfolioData = [
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

export async function GET(req: NextRequest) {
  try {
    console.log("Portfolio API aufgerufen");
    
    // Verwende lokale Daten anstelle von Baserow
    console.log(`${fallbackPortfolioData.length} Portfolio-Einträge gefunden`);
    
    // Debug: Zeige die ersten 3 Einträge mit ihren URLs
    if (fallbackPortfolioData.length > 0) {
      console.log("Portfolio-Einträge (erste 3):");
      fallbackPortfolioData.slice(0, 3).forEach((item, index) => {
        console.log(`Eintrag ${index + 1} - ID: ${item.id}, URL: ${item.url}`);
      });
    } else {
      console.log("Keine Portfolio-Einträge gefunden");
    }
    
    // Daten zurückgeben
    return NextResponse.json({ 
      count: fallbackPortfolioData.length,
      items: fallbackPortfolioData
    });
    
  } catch (error) {
    console.error("Portfolio API Fehler:", error);
    return NextResponse.json({ 
      error: `Server-Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
    }, { status: 500 });
  }
}
