import { NextRequest, NextResponse } from 'next/server';

// Da wir keine Datenbank haben, verwenden wir eine In-Memory-Lösung
// Diese Daten werden bei jedem Server-Neustart zurückgesetzt
interface VisitorStats {
  totalVisits: number;
  activeVisitors: number;
  lastVisits: {
    timestamp: number;
    sessionId: string;
  }[];
}

// Initialer Zustand
const stats: VisitorStats = {
  totalVisits: 0,
  activeVisitors: 0,
  lastVisits: []
};

// Zeitraum, in dem ein Besucher als "aktiv" gilt (15 Minuten)
const ACTIVE_TIMEOUT = 15 * 60 * 1000; // 15 Minuten in Millisekunden

// Funktion zum Bereinigen alter Besucher
function cleanupOldVisitors() {
  const now = Date.now();
  const activeThreshold = now - ACTIVE_TIMEOUT;
  
  // Entferne Besucher, die länger als ACTIVE_TIMEOUT inaktiv sind
  stats.lastVisits = stats.lastVisits.filter(visit => visit.timestamp > activeThreshold);
  
  // Aktualisiere die Anzahl der aktiven Besucher
  stats.activeVisitors = stats.lastVisits.length;
}

export async function GET(req: NextRequest) {
  // Bereinige alte Besucher
  cleanupOldVisitors();
  
  // Gib aktuelle Statistiken zurück
  return NextResponse.json({
    totalVisits: stats.totalVisits,
    activeVisitors: stats.activeVisitors
  });
}

export async function POST(req: NextRequest) {
  try {
    // Bereinige alte Besucher
    cleanupOldVisitors();
    
    // Extrahiere die Session-ID aus dem Request
    const body = await req.json();
    const sessionId = body.sessionId || `anonymous-${Date.now()}`;
    
    // Prüfe, ob dieser Besucher bereits aktiv ist
    const existingVisitIndex = stats.lastVisits.findIndex(visit => visit.sessionId === sessionId);
    
    if (existingVisitIndex >= 0) {
      // Aktualisiere den Zeitstempel für den bestehenden Besucher
      stats.lastVisits[existingVisitIndex].timestamp = Date.now();
    } else {
      // Füge einen neuen Besucher hinzu
      stats.lastVisits.push({
        sessionId,
        timestamp: Date.now()
      });
      
      // Erhöhe die Gesamtzahl der Besuche
      stats.totalVisits++;
      
      // Aktualisiere die Anzahl der aktiven Besucher
      stats.activeVisitors = stats.lastVisits.length;
    }
    
    // Gib aktuelle Statistiken zurück
    return NextResponse.json({
      totalVisits: stats.totalVisits,
      activeVisitors: stats.activeVisitors
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Besucherstatistik:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
