import type MovieInfo from "../MovieInfo";
import { useMovieContext } from "../context/MovieContext";  

export default function MovieCard({currentMovie}: {currentMovie: MovieInfo}) {
  const { isFavorite, addToFavs, removeFromFavs } = useMovieContext();
  const isCurrentFavorite = isFavorite(currentMovie.id);

  const favoriteMovie = (e: any) => {
    e.preventDefault();
    isCurrentFavorite ? removeFromFavs(currentMovie.id) : addToFavs(currentMovie);
  }
  
  return ( 
  <div className="movie-card">
    <div className="movie-poster">
      <img src={currentMovie.poster_path !== null ? `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}` : 
                     "https://ih1.redbubble.net/image.4905811447.8675/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"} 
           alt={currentMovie.title} />
      <div className="movie-overlay">
      <button className={`favorite-btn ${isCurrentFavorite ? "active" : ""}`} onClick={favoriteMovie}>♥</button>
      </div>
    </div>
    <div className="movie-info">
      <h3>{currentMovie.title}</h3>
      <p>{currentMovie.release_date.split("-")[0]}</p>
    </div>
  </div>);
}