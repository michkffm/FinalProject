# FinalProject · EasyHelfer

EasyHelfer ist eine gemeinsam entwickelte Fullstack-Plattform für Dienstleistungen. Sie verbindet Menschen, die Unterstützung suchen, mit passenden Anbietern. Nutzer können Dienstleistungen veröffentlichen, Angebote durchsuchen und direkt miteinander Kontakt aufnehmen.

## Funktionen

- **Registrierung und Anmeldung:** Benutzerkonto erstellen und anmelden.
- **Persönliches Profil:** Kategorie, Beschreibung, Standort, Profilbild und Rollen verwalten.
- **Dienstleistungen:** Angebote mit Beschreibung, Preis, Kategorie und Kontaktdaten erstellen.
- **Suche und Filter:** Angebote nach Suchbegriff, Kategorie, Preis und Standort finden.
- **Nachrichten:** Anbieter kontaktieren und sich in Chats austauschen.
- **Bewertungen:** Dienstleistungen bewerten und Bewertungen anderer Nutzer ansehen.
- **Kontakt und Kontowiederherstellung:** Kontaktformular und Passwort-Zurücksetzen per E-Mail.

## Technologien

| Bereich | Technologien |
| --- | --- |
| Frontend | React, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Datenbank | MongoDB, Mongoose |
| Anmeldung | JSON Web Tokens, bcrypt |
| E-Mail-Versand | Resend |

## Mein Beitrag

Ich war **Projektleiter** und habe in mehreren Bereichen des Projekts mitentwickelt. Die Anwendung entstand im Team, die Umsetzung der einzelnen Funktionen ist eine gemeinsame Leistung.

Das Projekt verbindet die Entwicklung der Benutzeroberfläche mit API-Routen, Datenmodellen und der Anbindung einer Datenbank.

## Lokale Einrichtung

Voraussetzungen: Node.js ab Version 22.12, npm und eine erreichbare MongoDB.

### Repository herunterladen

```bash
git clone https://github.com/michkffm/FinalProject.git
cd FinalProject
```

### Backend starten

Die Datei `backend/.env` anlegen und die folgenden Variablen setzen:

| Variable | Verwendung |
| --- | --- |
| `DB_URI` | Verbindungsadresse der MongoDB-Datenbank |
| `JWT_SECRET_KEY` | Zufälliger geheimer Schlüssel mit mindestens 32 Zeichen |
| `PORT` | Optionaler API-Port; Standard: `3000` |
| `FRONTEND_URL` | Optionaler Frontend-Ursprung; Standard: `http://localhost:5173` |
| `RESEND_API_KEY` | Für den Versand von Passwort-Reset-Mails |
| `RESEND_EMAIL` | Beim Mailanbieter zugelassene Absenderadresse |

Anschließend im Projektverzeichnis ausführen:

```bash
cd backend
npm ci
npm run dev
```

### Frontend starten

Ein zweites Terminal im Projektverzeichnis öffnen:

```bash
cd frontend
npm ci
npm run dev
```

Das Frontend ist standardmäßig unter `http://localhost:5173` erreichbar und verwendet die API unter `http://localhost:3000`. Eine andere API-Adresse lässt sich mit `VITE_API_URL` in `frontend/.env` festlegen. Der Wert von `FRONTEND_URL` im Backend muss zum verwendeten Frontend-Ursprung passen.
