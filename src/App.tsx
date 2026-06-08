import { MovieProvider } from "./context/MovieContext";
import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";

export default function App() {
  return (
  <MovieProvider>
    <NavBar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/favorites" element={<Favorites />}/>
      </Routes>
    </main>
  </MovieProvider>);
}
