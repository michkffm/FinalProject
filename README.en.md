# EasyHelfer · Our Final Project

[Deutsch](README.md) | **English**

EasyHelfer is a collaboratively developed web application for connecting people with service providers. People looking for help with everyday tasks or specific projects can find suitable services and contact providers directly. Those who want to offer a service can create a profile and publish their own listings.

The project combines a React frontend with a Node.js backend and a MongoDB database.

[**Explore EasyHelfer live →**](https://easyhelfer.vercel.app/)

## Preview

[![Current EasyHelfer homepage with search and service categories](docs/easyhelfer-homepage-v3.jpg)](https://easyhelfer.vercel.app/)

## Features

- **User accounts:** Register, sign in and reset your password by email.
- **Profiles:** Manage personal details, a profile picture, location and service categories.
- **Services:** Create, edit and delete your own listings with a description, category, price and contact details.
- **Search:** Filter listings by keyword, category, location and price, and sort by price or recency.
- **Categories:** Explore service categories through the image carousel on the homepage.
- **Messages:** Contact providers, send replies and load older messages. Unread messages are shown in the navigation menu.
- **Reviews:** Rate services and view existing reviews.
- **Contact:** Send a message to the project through the contact form.

## Technologies

| Area | Technologies |
| --- | --- |
| Frontend | React, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Email delivery | Resend |
| Hosting | Vercel for both frontend and backend |

## Installation

### Prerequisites

- Node.js **24.x** with npm
- Git
- An accessible MongoDB database, either locally or through MongoDB Atlas
- For the contact form and password reset: a Resend account with an API key and a verified sender domain

### 1. Clone the repository

```bash
git clone https://github.com/michkffm/FinalProject.git
cd FinalProject
```

### 2. Configure the backend

Create a `.env` file in the `backend` directory. The application uses the following environment variables:

| Variable | Purpose |
| --- | --- |
| `DB_URI` | Connection string for your MongoDB database |
| `JWT_SECRET_KEY` | A random secret key with at least 32 characters for authentication |
| `PORT` | Backend port; default: `3000` |
| `FRONTEND_URL` | Frontend URL; locally: `http://localhost:5173` |
| `RESEND_API_KEY` | Your Resend API key for contact and password reset emails |
| `RESEND_EMAIL` | A sender address approved by Resend |
| `CONTACT_EMAIL` | Recipient address for messages submitted through the contact form |

You can generate a random value for `JWT_SECRET_KEY` using this command and copy it into your `.env` file:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Write each variable on a separate line in the `.env` file using `NAME=VALUE`. This file contains private credentials and must not be committed to the repository. The other features can be used locally without configuring Resend; contact and password reset emails require the email settings listed above.

### 3. Start the backend

From the project directory:

```bash
cd backend
npm ci
npm run dev
```

The API runs at `http://localhost:3000` by default.

### 4. Start the frontend

Open a second terminal in the project directory:

```bash
cd frontend
npm ci
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

The frontend uses the API at `http://localhost:3000` by default. To use a different backend URL, set `VITE_API_URL` in `frontend/.env`. The backend's `FRONTEND_URL` must match the actual frontend URL.

## Usage

1. **Explore services:** Enter a search term on the homepage or select a service category. Filter and sort the results.
2. **Create an account:** Select “Registrieren” to register, then sign in.
3. **Set up your profile:** Add your details and the services you offer to your profile.
4. **Offer a service:** Create a listing from your profile with a title, description, category, price and contact details.
5. **Get in touch:** Send a message about a suitable listing. Continue the conversation through “Nachrichten”.
6. **Leave a review:** Submit a review on the listing page.

## Project Structure

```text
FinalProject/
├── frontend/     React interface and styling
├── backend/      Express API, data models and email delivery
└── docs/         Screenshots for the project presentation
```

## Team Collaboration

EasyHelfer was created as our shared final project. From designing the interface to implementing the backend and database, we developed the application together.

| Team Member | GitHub Profile |
| --- | --- |
| Bilal Bagci | [![Bilal Bagci's GitHub profile](docs/github-cat.png)](https://github.com/webdevbfb) |
| Pacome Adoufack | [![Pacome Adoufack's GitHub profile](docs/github-cat.png)](https://github.com/Pacome-Adoufack) |
| Sükrü Cebeci | [![Sükrü Cebeci's GitHub profile](docs/github-cat.png)](https://github.com/Okyanuspol) |
| Michael Koch | [![Michael Koch's GitHub profile](docs/github-cat.png)](https://github.com/michkffm) |

## Author

Author and project: [Michael Koch](https://github.com/michkffm)
