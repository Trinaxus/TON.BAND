import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });

const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://br.tonbandleipzig.de/api";
const BASEROW_USER_TABLE_ID = process.env.BASEROW_USER_TABLE_ID || "669";
const BASEROW_TOKEN = process.env.BASEROW_ADMIN_TOKEN || process.env.BASEROW_TOKEN;

if (!BASEROW_API_URL || !BASEROW_USER_TABLE_ID || !BASEROW_TOKEN) {
  console.error("Fehlende Baserow-Umgebungsvariablen!");
  process.exit(1);
}

const USER_FIELD_ROLE = "role"; // Feldname in Baserow
const ROLE_ID_USER = 2854;
const ROLE_STRING = "user";

async function main() {
  // Alle User abrufen
  const url = `${BASEROW_API_URL}/database/rows/table/${BASEROW_USER_TABLE_ID}/?user_field_names=true&size=200`;
  const res = await fetch(url, {
    headers: { Authorization: `Token ${BASEROW_TOKEN}` },
  });
  if (!res.ok) {
    console.error("Fehler beim Abrufen der User:", await res.text());
    process.exit(1);
  }
  const data = await res.json();
  let updated = 0;
  for (const user of data.results) {
    if (user[USER_FIELD_ROLE] === ROLE_ID_USER) {
      // User aktualisieren: setze role auf "user" (Text)
      const updateUrl = `${BASEROW_API_URL}/database/rows/table/${BASEROW_USER_TABLE_ID}/${user.id}/?user_field_names=true`;
      const updateRes = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${BASEROW_TOKEN}`,
        },
        body: JSON.stringify({ [USER_FIELD_ROLE]: ROLE_STRING }),
      });
      if (updateRes.ok) {
        updated++;
        console.log(`User ${user.id} aktualisiert: role → 'user'`);
      } else {
        console.error(`Fehler beim Aktualisieren von User ${user.id}:`, await updateRes.text());
      }
    }
  }
  console.log(`Fertig! ${updated} User aktualisiert.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
