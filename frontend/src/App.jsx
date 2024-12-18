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
import { Category } from "./components/Category.jsx";

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
      <Routes>
        {/* Hauptseiten-Routen */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categorie" element={<Category />} />
        <Route path="/profile/profileDelete/:id" element={<ProfileDelete />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/agb" element={<TermsAndConditions />} /> {/* Route für AGB */}
        <Route path="/contact" element={<ContactForm />} /> {/* Route für das Kontaktformular */}
      </Routes>
      <Footer /> {/* Footer immer sichtbar */}
    </>
  );
}

export default App;