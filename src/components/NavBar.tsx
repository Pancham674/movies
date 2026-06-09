import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <header>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">Movies</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home </Link>
                    <Link to="/favorites" className="navbar-link">Favorites</Link>
                </div>
            </nav>
        </header>
    );
}