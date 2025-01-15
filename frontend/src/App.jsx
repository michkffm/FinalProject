import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import { MessagesPage } from "./components/MessagesPage.jsx"; // Importiere die neue Nachrichten-Seite

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Header immer sichtbar */}
      <div className="content">
        <Routes>
          {/* Hauptseiten-Routen */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categorie/:name" element={<Category />} />
          <Route path="/hauptCategorie" element={<HauptCategory />} />
          <Route path="/jobs" element={<Job/>} />
          <Route path="/ratings/:jobId" element={<Ratings/>} />
          <Route path="/ratingsView/:jobId" element={<RatingsView/>} />
          <Route path="/suche" element={<Search/>} />
          <Route path="/profile/profileDelete/:id" element={<ProfileDelete />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/passwort-vergessen" element={<ForgotPassword />} />
          <Route path="/passwort-reset/:token" element={<ResetPassword />} />
          <Route path="/agb" element={<TermsAndConditions />} /> {/* Route für AGB */}
          <Route path="/contact" element={<ContactForm />} /> {/* Route für das Kontaktformular */}
          <Route path="/datenschutz" element={<Datenschutz />} /> {/* Route für die Datenschutzerklärung */}
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/messages" element={<MessagesPage />} /> {/* Neue Route für Nachrichten */}
        </Routes>
      </div>
      <Footer /> {/* Footer immer sichtbar */}
    </>
  );
}

export default App;