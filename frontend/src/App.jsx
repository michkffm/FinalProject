import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Main } from "./components/Main.jsx";
import { Register } from "./components/Register.jsx";

function App() {
  return (
    <>
   
      <Header /> {/* Header immer sichtbar */}
      <Routes>
        {/* Hauptseiten-Routen */}
        <Route path="/Home" element={<Main />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer /> {/* Footer immer sichtbar */}
      </>
  );
}

export default App;
