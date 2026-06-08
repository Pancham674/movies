import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <header>
            <nav className="navbar">
                <div className="nabvar-brand">
                    <Link to="/">Moobies</Link>
                </div>
                <div className="nabvar-links">
                    <Link to="/" className="navbar-link">Home </Link>
                    <Link to="/favorites" className="navbar-link">Favorites</Link>
                </div>
            </nav>
        </header>
    );
}