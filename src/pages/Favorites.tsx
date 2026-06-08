import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../context/MovieContext";  

export default function Favorites() {
    const { favMovies } = useMovieContext();

    if (favMovies.length > 0 ) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movies-grid">
                    {
                        favMovies.map(movie => <MovieCard key={movie.id} currentMovie={movie}/>)
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-empty">
            <h2>No favorites yet.</h2>
            <p>du Bastard hurensohn</p>
        </div>
    );
}