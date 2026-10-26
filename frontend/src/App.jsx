import { getSessionUserId } from "./session.js";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Home } from "./components/Home.jsx";
import { Register } from "./components/Register.jsx";
import { Login } from "./components/Login.jsx";
import Impressum from "./pages/Impressum.jsx";
import { TermsAndConditions } from "./pages/Agb.jsx";
import { Profile } from "./components/Profile.jsx";
import ContactForm from "./components/ContactForm.jsx";
import { ProfileDelete } from "./components/ProfileDelete.jsx";
import { Job } from "./components/Job.jsx";
import { Category } from "./components/Category.jsx";
import { HauptCategory } from "./components/HauptCategory.jsx";
import { Datenschutz } from "./pages/Datenschutz.jsx"; // Importiere die Datenschutz-Komponente
import { Inbox } from "./components/Inbox.jsx";
import { Search } from "./components/Search.jsx";
import { Ratings } from "./components/Ratings.jsx";
import { RatingsView } from "./components/RatingsView.jsx";
import { ForgotPassword } from "./components/ForgotPassword.jsx";
import { ResetPassword } from "./components/ResetPassword.jsx";
import { Help } from "./components/Help.jsx";
import { MessagesPage } from "./components/MessagesPage.jsx"; // Importiere die neue Nachrichten-Seite
import { PaymentMethods } from "./components/PaymentMethods.jsx"; // hinzugefügt von Bilal
import { ProtectedRoute } from "./components/ProtectedRoute.jsx"; // Importiere die ProtectedRoute-Komponente
function App() {
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getSessionUserId(localStorage.getItem("token"))));
  useEffect(() => {
    setIsLoggedIn(Boolean(getSessionUserId(localStorage.getItem("token"))));
  }, [pathname]);
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Header immer sichtbar */}
      <div className="content flex-grow">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/passwort-vergessen" element={<ForgotPassword />} />
          <Route path="/passwort-reset/:token" element={<ResetPassword />} />
          <Route path="/agb" element={<TermsAndConditions />} /> {/* Route für AGB */}
          <Route path="/contact" element={<ContactForm />} /> {/* Route für das Kontaktformular */}
          <Route path="/datenschutz" element={<Datenschutz />} /> {/* Route für die Datenschutzerklärung */}
          <Route path="/hilfe" element={<Help />} />
          <Route path="*" element={<main className="zero-section min-h-screen px-4 pt-40 text-center"><h1>Seite nicht gefunden</h1><a href="/">Zur Startseite</a></main>} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/categorie/:name" element={<Category />} />
          <Route path="/payment/:jobId" element={<PaymentMethods />} /> {/* hinzugefügt von Bilal */}
          <Route path="/hauptCategorie" element={<HauptCategory />} />
          <Route path="/jobs" element={<Job/>} />
          <Route path="/ratings/:jobId" element={<Ratings/>} />
          <Route path="/ratingsView/:jobId" element={<RatingsView/>} />
          <Route path="/suche" element={<Search/>} />
          <Route path="/profile/profileDelete/:id" element={<ProfileDelete />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/messages" element={<MessagesPage />} /> {/* Neue Route für Nachrichten */}
          </Route>
        </Routes>
      </div>
      <Footer /> {/* Footer immer sichtbar */}
      </div>
    </>
  );
}
export default App;