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
              Verantwortlich: Martin Lach<br />
              Bitterfelder Straße 2a, 04129 Leipzig, Deutschland<br />
              E-Mail: <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a>
            </p>
            <p className="mt-2">
              Website: <a href="https://ton-band.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">https://ton-band.vercel.app</a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten gemäß DSGVO und BDSG. Der Besuch unserer Website ist grundsätzlich ohne Angabe personenbezogener Daten möglich.
              Soweit personenbezogene Daten erhoben werden (z.&nbsp;B. im Rahmen von Kontaktaufnahmen oder Bildveröffentlichungen), geschieht dies auf Grundlage einer
              gesetzlichen Erlaubnis oder Ihrer Einwilligung.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Hosting & Logfiles (Vercel)</h2>
            <p>
              Unsere Website wird bei Vercel, Inc. gehostet. Beim Aufruf unserer Seiten verarbeitet Vercel technische Server-Logdaten (z.&nbsp;B. IP-Adresse, Datum/Uhrzeit,
              angeforderte Ressource/URL, Referer, User-Agent, HTTP-Statuscode). Zweck der Verarbeitung ist die Sicherstellung eines sicheren, stabilen und leistungsfähigen
              Betriebs, die Fehleranalyse sowie die Missbrauchsvermeidung.
            </p>
            <p className="mt-2">
              <strong>Rechtsgrundlage:</strong> Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse).
            </p>
            <p>
              <strong>Speicherdauer:</strong> Logdaten werden maximal 30–90 Tage gespeichert und anschließend gelöscht oder anonymisiert (konkrete Fristen können je nach
              Konfiguration abweichen).
            </p>
            <p>
              <strong>Datenübermittlung in Drittländer:</strong> Eine Verarbeitung kann in den USA oder anderen Drittländern erfolgen. Für solche Übermittlungen nutzt Vercel
              geeignete Garantien (z.&nbsp;B. EU‑Standardvertragsklauseln / Data Privacy Framework, soweit anwendbar).
            </p>
            <p>
              Weitere Informationen: Hinweise zum Datenschutz von Vercel finden Sie in den offiziellen Datenschutzbestimmungen von Vercel.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Einsatz von Cookies & Tracking</h2>
            <p>
              Derzeit setzen wir keine Cookies und keine Analyse- oder Tracking-Tools ein. Es werden keine personenbezogenen Nutzungsprofile erstellt.
            </p>
            <p>
              Falls künftig Analyse- oder Marketing-Tools eingesetzt werden (z.&nbsp;B. Matomo, Google Analytics), informieren wir Sie vorab gesondert und bieten eine
              Einwilligungs- bzw. Widerspruchsmöglichkeit.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Bildaufnahmen (Fotografie/Video) & Veröffentlichungen</h2>
            <p>
              Wir fertigen im Rahmen von Sessions/Veranstaltungen Foto- und Videoaufnahmen an (u.&nbsp;a. zu Dokumentations- und Präsentationszwecken sowie zur Öffentlichkeitsarbeit). Dabei
              können Personen erkennbar abgebildet sein.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">Bildaufnahmen / Fotografien / Bilddaten – Zweck der Aufnahme</h3>
            <p>
              Wir fotografieren und filmen im Rahmen von Events, Sessions etc. mit dem Ziel (z.&nbsp;B.) Dokumentation, Veröffentlichung auf unserer Website,
              Öffentlichkeitsarbeit und Ausstellung.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.1 Zwecke</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Dokumentation und Darstellung unserer Aktivitäten</li>
              <li>Veröffentlichung auf unserer Website und ggf. Social‑Media‑Profilen/Printmedien</li>
              <li>Interne Archivierung</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.2 Rechtsgrundlagen</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Einwilligung (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO), insbesondere bei Portraits/Einzelaufnahmen oder Veröffentlichungen mit klar erkennbaren Personen.</li>
              <li>Berechtigtes Interesse (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO) bei Reportage-/Übersichtsaufnahmen von (öffentlichen) Veranstaltungen, sofern keine überwiegenden Interessen der Betroffenen entgegenstehen.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.3 Information der Betroffenen</h3>
            <p>
              Wir informieren Betroffene vor oder während der Aufnahmen über Zweck, Verwendungsorte (Website/Social Media), Verantwortliche, Kontaktmöglichkeit und
              Widerrufsrechte. Auf Wunsch stellen wir Hinweise vor Ort bereit.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.4 Veröffentlichung & Weitergabe</h3>
            <p>
              Veröffentlichungen erfolgen nur bei vorliegender Rechtsgrundlage (Einwilligung/Berechtigtes Interesse). Eine Weitergabe an Dritte (z.&nbsp;B. Druckereien,
              Social‑Media‑Plattformen) erfolgt nur soweit erforderlich. Bei Uploads auf Plattformen können deren eigene Datenverarbeitungen stattfinden (siehe deren Datenschutzhinweise).
            </p>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.5 Speicherdauer</h3>
            <p>
              Bilddaten werden für die oben genannten Zwecke gespeichert und regelmäßig überprüft. Wir löschen oder anonymisieren Aufnahmen, wenn sie für die Zwecke nicht mehr erforderlich sind oder Einwilligungen widerrufen wurden. Richtwert: 2–5 Jahre für Veröffentlichungen, länger bei Archivzwecken, sofern berechtigte Interessen bestehen.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">5.6 Rechte der Betroffenen</h3>
            <p>
              Betroffene können Auskunft, Berichtigung, Löschung, Einschränkung oder Widerspruch verlangen; erteilte Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden. Kontakt: <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a>.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Externe Links & eingebettete Inhalte</h2>
            <p>
              Unsere Website kann Links auf externe Seiten (z.&nbsp;B. YouTube, Instagram, WhatsApp) enthalten. Für die Inhalte der verlinkten Seiten sind stets deren Betreiber verantwortlich. Werden Inhalte Dritter eingebettet, können beim Laden Daten (inkl. IP-Adresse) an die jeweiligen Anbieter übermittelt werden; diese können Cookies setzen. Bitte beachten Sie die Datenschutzhinweise der jeweiligen Anbieter.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Kontaktaufnahme</h2>
            <p>
              Bei Kontaktaufnahme (z.&nbsp;B. per E-Mail) verarbeiten wir die mitgeteilten Daten zur Bearbeitung Ihres Anliegens.
            </p>
            <p>
              <strong>Rechtsgrundlage:</strong> Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (vorvertragliche/vertragliche Maßnahmen) oder lit.&nbsp;f DSGVO (berechtigtes Interesse an effizienter Kommunikation).
            </p>
            <p>
              Wir löschen Anfragen, sofern diese nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Rechte der betroffenen Personen</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Auskunft (Art.&nbsp;15 DSGVO)</li>
              <li>Berichtigung (Art.&nbsp;16 DSGVO)</li>
              <li>Löschung (Art.&nbsp;17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art.&nbsp;20 DSGVO)</li>
              <li>Widerspruch (Art.&nbsp;21 DSGVO)</li>
              <li>Widerruf von Einwilligungen mit Wirkung für die Zukunft (Art.&nbsp;7 Abs.&nbsp;3 DSGVO)</li>
            </ul>
            <p className="mt-2">Zur Ausübung Ihrer Rechte genügt eine E-Mail an <a href="mailto:kontakt@tonbandleipzig.de" className="text-[#00e1ff] hover:underline">kontakt@tonbandleipzig.de</a>.</p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Zuständig ist in der Regel die Aufsichtsbehörde Ihres Wohnsitzes bzw. des Ortes der mutmaßlichen Verletzung.
            </p>
            <p>
              Für Sachsen: Der Sächsische Datenschutzbeauftragte, Schützenstraße 18, 01099 Dresden, <a href="https://www.saechsdsb.de" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline">www.saechsdsb.de</a>.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder technische Änderungen anzupassen. Die jeweils aktuelle Version ist unter
              <a href="https://ton-band.vercel.app/datenschutz" target="_blank" rel="noopener noreferrer" className="text-[#00e1ff] hover:underline"> https://ton-band.vercel.app/datenschutz</a> abrufbar.
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
