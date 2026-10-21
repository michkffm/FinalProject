# FinalProject · Plattform für Dienstleistungen

Ein gemeinschaftlich entwickeltes Fullstack-Projekt: Nutzer können Dienstleistungen anbieten, Angebote nach Kategorien durchsuchen, Nachrichten austauschen und Bewertungen abgeben. Das Repository enthält eine React-Oberfläche und eine Express-API mit MongoDB.

**React 18 · Vite 8 · React Router · Tailwind CSS · Node.js · Express · MongoDB · JWT**

## Mein Beitrag

Ich war **Projektleiter** und habe in mehreren Bereichen des Projekts mitentwickelt. Die Anwendung entstand im Team; die Umsetzung der einzelnen Funktionen ist eine gemeinsame Leistung.

Das Projekt verbindet Oberflächenentwicklung, API-Routen, Datenmodelle und Authentifizierung in einer gemeinsamen Anwendung.

## Funktionsbereiche im Code

- Registrierung, Anmeldung und persönliches Profil.
- Angebote für Dienstleistungen sowie Kategorien und Suche.
- Nachrichten und Antworten zwischen Nutzern.
- Bewertungen zu Angeboten.
- Kontaktformular und Passwort-Zurücksetzen über E-Mail.
- Eine vorbereitete PayPal-Oberfläche; keine hier verifizierte Zahlungsabwicklung.

Diese Liste beschreibt den vorhandenen Code. Sie ist keine Bestätigung, dass alle Abläufe vollständig oder für den Produktivbetrieb geeignet sind.

## Aufbau

```text
frontend/
  src/components/     Oberfläche, Formulare und Seitenbereiche
  src/pages/          Weitere Seiten
backend/
  server.js           Aktiver Server mit API-Routen
  models/             Nutzer, Angebote, Nachrichten und Bewertungen
  middlewares/        Token-Prüfung
  routes/             Weitere Routenmodule
.github/workflows/    Build- und Orchestrierungsabläufe
```

Der Startbefehl verwendet `backend/server.js`. Die zusätzlichen Dateien unter `backend/routes/` werden dort nicht automatisch als Router eingebunden.

## Lokale Einrichtung

Voraussetzungen: Node.js ab 22.12, npm und eine erreichbare MongoDB.

```bash
git clone https://github.com/michkffm/FinalProject.git
cd FinalProject
```

### Backend

Eine lokale, nicht versionierte Datei `backend/.env` mit folgenden Variablen anlegen:

| Variable | Verwendung |
| --- | --- |
| `DB_URI` | MongoDB-Verbindung |
| `PORT` | Serverport; das Frontend erwartet `3000` |
| `JWT_SECRET_KEY` | Geheimer Schlüssel für Sitzungstokens |
| `RESEND_EMAIL` | Absender für den Passwort-Reset |

```bash
cd backend
npm ci
npm run dev
```

**Mailversand:** Der aktuelle Server enthält einen fest eingetragenen Resend-Schlüssel. Diesen nicht verwenden. Vor einem Mailtest oder Deployment muss er beim Anbieter widerrufen und durch eine geschützte Umgebungsvariable ersetzt werden. Der Prototyp ist so nicht für ein öffentliches Backend vorbereitet.

### Frontend in einem zweiten Terminal

```bash
cd FinalProject/frontend
npm ci
npm run dev
```

Die Oberfläche erwartet die API unter `http://localhost:3000`. Für die vorbereitete PayPal-Komponente wird `VITE_PAYPAL_API_KEY` als öffentliche Client-ID gelesen; geheime Zugangsdaten gehören niemals in eine `VITE_`-Variable.

## Bekannte Einschränkungen

Der Frontend-Build wurde am 21. Oktober 2026 geprüft und scheitert aktuell an der bestehenden PostCSS-Konfiguration: Sie bindet `tailwindcss` direkt als Plugin ein, während das installierte Tailwind 4 ein separates PostCSS-Plugin erwartet. Diese Dokumentationsänderung behebt den Buildfehler nicht.

Außerdem bestehen lokale API- und Reset-Links sowie überlappende Routen in `server.js`. Vor einem produktiven Einsatz müssen Konfiguration, Berechtigungen und die vollständigen Abläufe überprüft werden. Eine öffentliche Live-Demo wurde nicht verifiziert; deshalb wird kein Demo-Link angegeben.

## Prüfstand

- Frontend-Abhängigkeiten mit `npm ci --ignore-scripts` installiert.
- `npm run build`: bestehender Tailwind-/PostCSS-Fehler, siehe oben.
- Backend, echte Nutzerkonten, Mailversand und Zahlungen bei dieser Dokumentationsüberarbeitung nicht getestet.
- Das Backend-Testskript enthält noch keine Tests.

[Michael Koch auf GitHub](https://github.com/michkffm) · [Interaktives Portfolio](https://michael-koch-portfolio.onrender.com/)
