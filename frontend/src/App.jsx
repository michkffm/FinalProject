import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Home } from "./components/Home.jsx";
import { Register } from "./components/Register.jsx";
import { Login } from "./components/Login.jsx";
import Impressum from "./pages/Impressum.jsx";
import { Profile } from "./components/Profile.jsx";

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
      </Routes>
      <Footer /> {/* Footer immer sichtbar */}
      </>
  );
}

export default App;
