export default function DatenschutzPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24, minHeight: '70vh' }}>
      <div style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <h1 className="text-4xl font-bold mb-8 text-[#00e1ff]">Datenschutzerklärung</h1>
        
        <div className="space-y-6 text-[#b4b4b4]" style={{ lineHeight: '1.8' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Verantwortlicher</h2>
            <p>
              ton.band Leipzig<br />
              Inhaber: Martin Lach<br />
              Bitterfelder Straße 2a<br />
              04129 Leipzig<br />
              Deutschland<br />
              E-Mail: <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a><br />
              Website: <a href="https://www.tonbandleipzig.de" className="text-[#00e1ff] hover:underline">www.tonbandleipzig.de</a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
            <p>
              Der Schutz Ihrer persönlichen Daten ist uns wichtig. Wir verarbeiten personenbezogene Daten ausschließlich 
              im Rahmen der geltenden Datenschutzgesetze. Unsere Website kann in der Regel ohne Angabe personenbezogener 
              Daten besucht werden. Soweit personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Hosting bei Netlify</h2>
            <p>
              Unsere Website wird von Netlify, Inc., 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA, gehostet. 
              Beim Besuch der Website erfasst Netlify technische Logdaten (z. B. IP-Adresse, Browsertyp, Uhrzeit des Zugriffs, 
              Referrer-URL). Diese Daten werden zur Sicherstellung eines sicheren und stabilen Betriebs verarbeitet 
              (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p className="mt-2">
              Netlify ist unter dem EU–US Data Privacy Framework zertifiziert. Weitere Informationen:{' '}
              <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">
                https://www.netlify.com/privacy/
              </a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Verlinkte Inhalte (YouTube, Social Media & Community)</h2>
            <p className="mb-4">
              Unsere Website enthält Verlinkungen zu externen Plattformen (z. B. YouTube, Instagram, WhatsApp). 
              Beim Anklicken eines Links verlassen Sie unsere Seite. Wir haben keinen Einfluss auf die dortige Datenverarbeitung.
            </p>
            <p>
              <strong>YouTube / Google LLC:</strong>{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">
                https://policies.google.com/privacy
              </a><br />
              <strong>Instagram / Meta Platforms Ireland Ltd.:</strong>{' '}
              <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">
                https://privacycenter.instagram.com/policy
              </a><br />
              <strong>WhatsApp / Meta Platforms Ireland Ltd.:</strong>{' '}
              <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">
                https://www.whatsapp.com/legal/privacy-policy-eea
              </a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Cookies & Tracking</h2>
            <p>
              Unsere Website verwendet keine Cookies und keine Analyse- oder Tracking-Tools. Es werden keine personenbezogenen 
              Nutzungsprofile erstellt.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Ihre Rechte</h2>
            <p className="mb-4">
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, 
              Datenübertragbarkeit und Widerspruch gemäß den Artikeln 15–21 DSGVO. Zur Ausübung genügt eine E-Mail an:{' '}
              <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a>.
            </p>
            <p>
              Außerdem steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, z. B. der Sächsischen 
              Datenschutzbeauftragten.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren, um sie an rechtliche oder 
              technische Entwicklungen anzupassen. Es gilt stets die aktuelle Version auf unserer Website.
            </p>
            <p className="mt-4 text-sm">
              <strong>Stand:</strong> Oktober 2025
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
