export default function ImpressumPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24, minHeight: '70vh' }}>
      <div style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <h1 className="text-4xl font-bold mb-8 text-[#00e1ff]">Impressum</h1>
        
        <div className="space-y-6 text-[#b4b4b4]" style={{ lineHeight: '1.8' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Angaben gemäß § 5 TMG</h2>
            <p>
              ton.band Leipzig<br />
              Inhaber: Martin Lach<br />
              Bitterfelder Straße 2a<br />
              04129 Leipzig<br />
              Deutschland
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG</h2>
            <p>
              Nicht erforderlich – Anwendung der Kleinunternehmerregelung nach § 19 UStG.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Martin Lach<br />
              Bitterfelder Straße 2a<br />
              04129 Leipzig
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Social Media & Community</h2>
            <p>
              Instagram: <a href="https://www.instagram.com/ton.bandleipzig" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">@ton.bandleipzig</a><br />
              YouTube: <a href="https://www.youtube.com/@tonbandleipzig" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">@tonbandleipzig</a><br />
              WhatsApp-Community: <a href="https://chat.whatsapp.com/IIZpQr2XNWdEO3ub34znOl" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">Zur Community</a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Hinweis gemäß § 19 UStG</h2>
            <p>
              Es erfolgt kein Ausweis der Umsatzsteuer aufgrund der Anwendung der Kleinunternehmerregelung.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Haftungsausschluss (Disclaimer)</h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. 
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Urheberrecht</h2>
            <p>
              Die durch ton.band Leipzig erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. 
              Eine Vervielfältigung, Bearbeitung, Verbreitung oder jede Art der Verwertung außerhalb der Grenzen des Urheberrechts 
              bedarf der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
