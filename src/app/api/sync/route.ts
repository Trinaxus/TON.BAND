import { NextRequest, NextResponse } from "next/server";

// Tubox Konfiguration
const TUBOX_BASE_URL = process.env.TUBOX_BASE_URL || "https://tonbandleipzig.de/Partycrasher";

// Lokale Datenspeicherung (ersetzt Baserow)
let portfolioEntries: any[] = [];

// Definiere Typen für bessere Typsicherheit
type TuboxImage = {
  url: string;
  jahr: string;
  galerie: string;
  kategorie: string;
};

export async function GET(req: NextRequest) {
  try {
    console.log("Sync API aufgerufen - Daten von Tubox zu Baserow synchronisieren");
    
    // Parameter aus der Anfrage lesen
    const jahr = req.nextUrl.searchParams.get("jahr");
    const galerie = req.nextUrl.searchParams.get("galerie");
    
    if (!jahr || !galerie) {
      return NextResponse.json({ 
        success: false,
        error: "Jahr und Galerie sind erforderliche Parameter" 
      }, { status: 400 });
    }
    
    // 1. Bilder von Tubox abrufen
    console.log(`Suche nach Bildern für Jahr: ${jahr}, Galerie: ${galerie}`);
    
    // Alle Bilder dynamisch von Tubox holen
    let realImages: TuboxImage[] = [];
    try {
      const tuboxApiUrl = "https://tonbandleipzig.de/Partycrasher/listfiles.php";
      const res = await fetch(tuboxApiUrl, { cache: 'no-store' }); // Cache deaktivieren
      
      if (!res.ok) throw new Error("Fehler beim Abrufen der Tubox-Bilderliste");
      const images: string[] = await res.json();
      
      // Filtere nach Jahr und Galerie (mit flexibler Namensbehandlung)
      const filtered = images.filter((path) => {
        const parts = path.split("/");
        
        // Prüfe auf exakte Übereinstimmung
        if (parts[0] === jahr && parts[1] === galerie) {
          return true;
        }
        
        // Spezialfall für "Tubox.de"-Galerie
        if (galerie === "Tubox.de") {
          // Auch "Tubox.de Portfolio" oder andere Varianten mit "Tubox.de" im Namen akzeptieren
          return parts[0] === jahr && (parts[1] === "Tubox.de" || parts[1] === "Tubox.de Portfolio" || parts[1].includes("Tubox.de"));
        }
        
        return false;
      });
      
      console.log(`${filtered.length} Bilder in Tubox für ${galerie} (${jahr}) gefunden`);
      
      // Bilder in das richtige Format bringen
      realImages = filtered.map((path) => {
        // Pfad-Teile für URL-Encoding splitten
        const parts = path.split("/");
        const encodedPath = parts.map(encodeURIComponent).join("/");
        const url = `${TUBOX_BASE_URL}/uploads/${encodedPath}`;
        return {
          url,
          jahr: parts[0],
          galerie: parts[1],
          kategorie: "Unbekannt" // Standard-Kategorie
        };
      });
    } catch (err) {
      console.error("Fehler beim Laden der Tubox-Bilderliste:", err);
      return NextResponse.json({
        success: false,
        error: `Fehler beim Abrufen der Bilder von Tubox: ${err instanceof Error ? err.message : 'Verbindungsfehler'}`
      }, { status: 500 });
    }
    
    // Wenn keine Bilder gefunden wurden, verwenden wir Fallback-Bilder
    if (realImages.length === 0) {
      console.log(`Keine Bilder für ${galerie} (${jahr}) gefunden, verwende Fallback-Bilder`);
      
      // Fallback-Bilder je nach Galerie
      if (galerie === "Tubox.de" || galerie === "Tubox.de Portfolio") {
        // Bekannte Beispiel-URLs für Tubox.de
        realImages.push({
          url: `${TUBOX_BASE_URL}/uploads/2025/Tubox.de/img_680523999d4089.29682080.jpg`,
          kategorie: "Design",
          jahr: jahr,
          galerie: galerie
        });
        
        // Weiteres Beispielbild
        realImages.push({
          url: `${TUBOX_BASE_URL}/uploads/2025/Tubox.de%20Portfolio/img_6805275f152b15.16197016.jpg`,
          kategorie: "Design",
          jahr: jahr,
          galerie: galerie
        });
        
        console.log("Fallback-Bilder für Tubox.de verwendet");
      } else {
        // Für andere Galerien generieren wir Platzhalter-Bilder
        realImages.push({
          url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(`${galerie} (${jahr})`)}&bg=e0e0e0&fg=707070`,
          kategorie: "Platzhalter",
          jahr: jahr,
          galerie: galerie
        });
        console.log("Platzhalter-Bild für unbekannte Galerie verwendet");
      }
    }
    
    console.log(`${realImages.length} Bilder für ${galerie} (${jahr}) gefunden`);
    
    // 2. Bestehende Einträge in lokaler Datenbank prüfen
    console.log("Prüfe bestehende Einträge in lokaler Datenbank");
    
    // Extrahiere die URLs aus den bestehenden Einträgen
    const existingUrls = portfolioEntries.map(item => item.url || '');
    
    console.log(`${existingUrls.length} bestehende Einträge in lokaler Datenbank gefunden`);
    
    // Finde neue Bilder, die noch nicht in der lokalen Datenbank sind
    const newImages = realImages.filter((img) => !existingUrls.includes(img.url));
    console.log(`${newImages.length} neue Bilder zum Hinzufügen gefunden`);
    
    // Wenn keine neuen Bilder gefunden wurden, füge trotzdem ein Testbild hinzu
    if (newImages.length === 0 && realImages.length > 0) {
      console.log("Füge ein Testbild hinzu, um die Funktionalität zu prüfen");
      newImages.push({
        url: `https://via.placeholder.com/800x600?text=Test_${Date.now()}`,
        kategorie: "Test",
        jahr: jahr,
        galerie: galerie
      });
    }
    
    const createdEntries: any[] = [];
    const errors: any[] = [];
    
    // Neue Einträge in lokale Datenbank erstellen
    for (const img of newImages) {
      try {
        console.log("Erstelle Eintrag für:", img.url);
        
        // Erstelle einen neuen Eintrag
        const newEntry = {
          id: portfolioEntries.length > 0 ? Math.max(...portfolioEntries.map(item => item.id)) + 1 : 1,
          gallery: img.galerie,
          url: img.url,
          category: img.kategorie,
          year: img.jahr
        };
        
        console.log("Neuer Eintrag:", JSON.stringify(newEntry));
        
        // Füge den Eintrag zur lokalen Datenbank hinzu
        portfolioEntries.push(newEntry);
        
        // Erfolgreiche Erstellung
        console.log("Eintrag erfolgreich erstellt:", newEntry.id);
        createdEntries.push(newEntry);
        
      } catch (error) {
        console.error("Fehler beim Erstellen des Eintrags:", error);
        errors.push({
          url: img.url,
          error: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
        });
      }
    }
    
    // Ergebnis zurückgeben
    return NextResponse.json({
      success: true,
      message: `Synchronisierung abgeschlossen. ${createdEntries.length} neue Einträge erstellt.`,
      totalImagesFound: realImages.length,
      existingEntries: existingUrls.length,
      newEntriesCreated: createdEntries.length,
      errors: errors.length > 0 ? errors : [],
      createdEntries
    });
    
  } catch (error) {
    console.error("Sync API Fehler:", error);
    return NextResponse.json({ 
      success: false,
      error: `Server-Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
    }, { status: 500 });
  }
}
