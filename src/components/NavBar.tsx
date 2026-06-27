import { useMovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

export default function NavBar() {
    const { setSelectedGenreId } = useMovieContext();
    function goToPopularMovies() {
        setSelectedGenreId(0);
    }

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link onClick={goToPopularMovies} to="/">Popular Movies</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home </Link>
                    <Link to="/favorites" className="navbar-link">Favorites</Link>
                </div>
            </nav>
        </header>
    );
}