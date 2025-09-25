import { NextRequest } from 'next/server';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export const runtime = 'nodejs';

// Streamt ein ZIP mit allen übergebenen Bild-URLs zurück
export async function POST(req: NextRequest) {
  try {
    const { galleryName, imageUrls } = await req.json();
    if (!galleryName || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return new Response(JSON.stringify({ error: 'Ungültige Parameter' }), { status: 400 });
    }

    const safeName = String(galleryName).replace(/\//g, '_');

    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archiver-Fehler:', err);
      passThrough.destroy(err);
    });

    // archiver in PassThrough schreiben
    archive.pipe(passThrough);

    // Dateien hinzufügen (per Fetch laden und als Buffer hinzufügen)
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuf = await res.arrayBuffer();
        const fileName = url.split('/').pop() || `file_${i + 1}`;
        archive.append(Buffer.from(arrayBuf), { name: fileName });
      } catch (err: unknown) {
        console.warn('Datei konnte nicht hinzugefügt werden:', url, err);
      }
    }

    // Finalisieren, sobald alle Dateien hinzugefügt sind
    archive.finalize();

    return new Response(passThrough as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeName}.zip"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    console.error('Download-API Fehler:', err);
    const message = err instanceof Error ? err.message : 'Serverfehler';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
