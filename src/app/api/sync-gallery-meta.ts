import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { galleryName, images, category, year } = req.body;
    
    if (!galleryName || !images || !images.length) {
      return res.status(400).json({ error: 'Galerie-Name und Bilder sind erforderlich' });
    }

    // Extrahiere Jahr aus dem Galerienamen, falls nicht explizit angegeben
    const extractedYear = year || extractYearFromGalleryName(galleryName);
    
    // Verwende das erste Bild als URL
    const firstImage = images[0];
    
    // Baserow-Konfiguration
    const baserowToken = process.env.BASEROW_TOKEN;
    const baserowApiUrl = process.env.BASEROW_API_URL || 'https://br.tubox.de/api';
    const portfolioTableId = process.env.BASEROW_PORTFOLIO_TABLE_ID || 668;
    
    // Prüfe, ob der Eintrag bereits existiert
    const checkResponse = await fetch(
      `${baserowApiUrl}/database/rows/table/${portfolioTableId}/?user_field_names=true&search=${encodeURIComponent(galleryName)}`,
      {
        headers: {
          'Authorization': `Token ${baserowToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const checkData = await checkResponse.json();
    const existingEntry = checkData.results.find((entry: any) => entry.gallery === galleryName);
    
    if (existingEntry) {
      // Aktualisiere den bestehenden Eintrag
      const updateResponse = await fetch(
        `${baserowApiUrl}/database/rows/table/${portfolioTableId}/${existingEntry.id}/?user_field_names=true`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${baserowToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gallery: galleryName,
            url: firstImage,
            category: category || 'Sonstiges',
            year: extractedYear
          })
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error(`Fehler beim Aktualisieren des Eintrags: ${await updateResponse.text()}`);
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Eintrag aktualisiert', 
        entry: await updateResponse.json() 
      });
    } else {
      // Erstelle einen neuen Eintrag
      const createResponse = await fetch(
        `${baserowApiUrl}/database/rows/table/${portfolioTableId}/?user_field_names=true`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${baserowToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gallery: galleryName,
            url: firstImage,
            category: category || 'Sonstiges',
            year: extractedYear
          })
        }
      );
      
      if (!createResponse.ok) {
        throw new Error(`Fehler beim Erstellen des Eintrags: ${await createResponse.text()}`);
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'Eintrag erstellt', 
        entry: await createResponse.json() 
      });
    }
  } catch (error) {
    console.error('Fehler bei der Synchronisierung:', error);
    res.status(500).json({ error: 'Fehler bei der Synchronisierung' });
  }
}

// Hilfsfunktion zum Extrahieren des Jahres aus dem Galerienamen
function extractYearFromGalleryName(galleryName: string): string {
  // Versuche, ein vierstelliges Jahr zu finden
  const yearMatch = galleryName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    return yearMatch[0];
  }
  
  // Wenn der Galeriename das Format "Jahr/Unterordner" hat
  if (galleryName.includes('/')) {
    const parts = galleryName.split('/');
    if (parts.length >= 1 && /^\d{4}$/.test(parts[0])) {
      return parts[0];
    }
  }
  
  // Fallback: Aktuelles Jahr
  return new Date().getFullYear().toString();
}
