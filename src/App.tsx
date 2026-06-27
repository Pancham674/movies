import { MovieProvider } from "./context/MovieContext";
import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites";
import NavBar from "./components/NavBar";
import Details from "./pages/Details";
import Home from "./pages/Home";
import "./css/App.css";
import Footer from "./components/Footer";

export default function App() {
  return (
  <MovieProvider>
    <NavBar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/genres/:genreId" element={<Home />}/>
        <Route path="/details/:id" element={<Details />}/>
        <Route path="/favorites" element={<Favorites />}/>
      </Routes>
    </main>
    <Footer />
  </MovieProvider>);
}
