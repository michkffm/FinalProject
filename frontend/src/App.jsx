import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Home } from "./components/Home.jsx";
import { Register } from "./components/Register.jsx";
import { Login } from "./components/Login.jsx";
import Impressum from "./pages/Impressum.jsx";
<<<<<<< HEAD
import { TermsAndConditions } from "./pages/Datenschutz.jsx";
=======
import { Profile } from "./components/Profile.jsx";
>>>>>>> e94d539d900b8c221c0a61c198967642d2aed3d3

function App() {
  return (
    <>
      <Header /> {/* Header immer sichtbar */}
      {/* <Profile /> */}
      <Routes>
        {/* Hauptseiten-Routen */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/agb" element={<TermsAndConditions />} /> {/* Route für AGB */}
      </Routes>
      <Footer /> {/* Footer immer sichtbar */}
    </>
  );
}

export default App;
