# EasyHelfer · Unser Final Projekt

EasyHelfer ist eine gemeinsam entwickelte Webanwendung zur Vermittlung von Dienstleistungen. Menschen, die Unterstützung im Alltag oder bei bestimmten Aufgaben suchen, können passende Angebote finden und die Anbieter direkt kontaktieren. Wer selbst eine Dienstleistung anbieten möchte, kann ein Profil erstellen und eigene Angebote veröffentlichen.

Das Projekt verbindet eine React-Oberfläche mit einem Node.js-Backend und einer MongoDB-Datenbank.

[**EasyHelfer live ansehen →**](https://easyhelfer.vercel.app/)

## Einblick

[![Aktuelle Startseite von EasyHelfer mit Suche und Dienstleistungskategorien](docs/easyhelfer-homepage-v3.jpg)](https://easyhelfer.vercel.app/)

## Funktionen

- **Benutzerkonto:** Registrieren, anmelden und das Passwort per E-Mail zurücksetzen.
- **Profil:** Persönliche Angaben, Profilbild, Standort und angebotene Kategorien verwalten.
- **Dienstleistungen:** Eigene Angebote mit Beschreibung, Kategorie, Preis und Kontaktdaten erstellen, bearbeiten und löschen.
- **Suche:** Angebote nach Suchbegriff, Kategorie, Standort und Preis filtern sowie nach Preis oder Aktualität sortieren.
- **Kategorien:** Dienstleistungsbereiche über den Bilder-Slider auf der Startseite entdecken.
- **Nachrichten:** Anbieter kontaktieren, Antworten schreiben und ältere Nachrichten nachladen. Ungelesene Nachrichten werden im Menü angezeigt.
- **Bewertungen:** Dienstleistungen bewerten und vorhandene Bewertungen ansehen.
- **Kontakt:** Über das Kontaktformular eine Nachricht an das Projekt senden.

## Technologien

| Bereich | Technologien |
| --- | --- |
| Frontend | React, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Datenbank | MongoDB, Mongoose |
| Anmeldung | JSON Web Tokens, bcrypt |
| E-Mail-Versand | Resend |
| Hosting | Vercel für Frontend und Backend |

## Installation

### Voraussetzungen

- Node.js **24.x** mit npm
- Git
- Eine erreichbare MongoDB-Datenbank, lokal oder über MongoDB Atlas
- Für Kontaktformular und Passwort-Zurücksetzen: ein Resend-Konto mit API-Schlüssel und verifizierter Absenderdomain

### 1. Repository herunterladen

```bash
git clone https://github.com/michkffm/FinalProject.git
cd FinalProject
```

### 2. Backend konfigurieren

Im Ordner `backend` eine Datei `.env` anlegen. Die Anwendung verwendet folgende Umgebungsvariablen:

| Variable | Bedeutung |
| --- | --- |
| `DB_URI` | Verbindungsadresse der eigenen MongoDB-Datenbank |
| `JWT_SECRET_KEY` | Zufälliger geheimer Schlüssel mit mindestens 32 Zeichen für die Anmeldung |
| `PORT` | Port des Backends; Standard: `3000` |
| `FRONTEND_URL` | Adresse des Frontends; lokal: `http://localhost:5173` |
| `RESEND_API_KEY` | Eigener Resend-API-Schlüssel für Kontakt- und Passwort-Reset-Mails |
| `RESEND_EMAIL` | Bei Resend zugelassene Absenderadresse |
| `CONTACT_EMAIL` | Empfängeradresse für Nachrichten aus dem Kontaktformular |

Einen zufälligen Wert für `JWT_SECRET_KEY` kannst du mit diesem Befehl erzeugen und in die `.env` übernehmen:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Jede Variable wird in der `.env` als `NAME=WERT` in eine eigene Zeile geschrieben. Die Datei enthält private Zugangsdaten und gehört nicht ins Repository. Ohne die Resend-Konfiguration können die übrigen Funktionen lokal genutzt werden; Kontakt- und Passwort-Reset-Mails benötigen die genannten Mail-Einstellungen.

### 3. Backend starten

Im Projektverzeichnis:

```bash
cd backend
npm ci
npm run dev
```

Die API läuft standardmäßig unter `http://localhost:3000`.

### 4. Frontend starten

Ein zweites Terminal im Projektverzeichnis öffnen:

```bash
cd frontend
npm ci
npm run dev
```

Anschließend [http://localhost:5173](http://localhost:5173) im Browser öffnen.

Das Frontend verwendet standardmäßig die API unter `http://localhost:3000`. Für eine andere Backend-Adresse in `frontend/.env` die Variable `VITE_API_URL` setzen. `FRONTEND_URL` im Backend muss zur tatsächlich verwendeten Frontend-Adresse passen.

## Nutzung

1. **Angebote entdecken:** Auf der Startseite einen Suchbegriff eingeben oder eine Dienstleistungskategorie auswählen. Die Ergebnisse lassen sich filtern und sortieren.
2. **Konto erstellen:** Über „Registrieren“ ein Benutzerkonto anlegen und anschließend anmelden.
3. **Profil einrichten:** Im Profil die eigenen Angaben und angebotenen Dienstleistungen ergänzen.
4. **Dienstleistung anbieten:** Im Profil ein Angebot mit Titel, Beschreibung, Kategorie, Preis und Kontaktangaben erstellen.
5. **Kontakt aufnehmen:** Bei einem passenden Angebot eine Nachricht schreiben. Die Unterhaltung lässt sich über „Nachrichten“ fortsetzen.
6. **Bewertung abgeben:** Auf der Angebotsseite eine Bewertung hinterlassen.

## Projektstruktur

```text
FinalProject/
├── frontend/     React-Oberfläche und Gestaltung
├── backend/      Express-API, Datenmodelle und E-Mail-Versand
└── docs/         Screenshots für die Projektvorstellung
```

## Gemeinschaftsarbeit

EasyHelfer entstand als unser gemeinsames Final Projekt. Die Gestaltung und Umsetzung der Anwendung sind eine Teamleistung. Michael Koch übernahm die Projektleitung und arbeitete in mehreren Entwicklungsbereichen mit.
