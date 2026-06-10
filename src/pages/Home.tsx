import { getPopularMovies, getSearchedMovies } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import type MovieInfo from "../MovieInfo";
import Search from "../components/Search";

export default function Home() {
    const { isLoading, setIsLoading } = useMovieContext();
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");;
    
    useEffect(() => {
            const loadPopularMovies = async () => {
                try {
                    const popularMovies = await getPopularMovies();
                    setMovies(popularMovies);
                } catch (error: any) {
                    console.log(error);
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }
            loadPopularMovies();
        }, []
    );

    const searchMovies = async (e: MouseEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || isLoading) { return; }
        setIsLoading(true);
        try {
            const searchedMovies = await getSearchedMovies(searchTerm);
            setMovies(searchedMovies);
            
            setError("");
            setSearchTerm("");
        } catch(error: any) {
            console.log(error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (<>
      <div className="Home">      
        <Search searchMoviesFunc={searchMovies}
            currentSearchTerm={searchTerm}
            setSearchTermFunc={setSearchTerm}
        />
        
        { 
        error ? 
            <div className="error-message">{error}</div> :
            isLoading ?
                <h3 className="loading">Hang on, we're still loading!</h3> :
                movies.length == 0 ?
                    <p className="no-movies">No movies could be found</p> :
                    <div className="movies-grid">{
                        movies.map(mov => <MovieCard key={mov.id} currentMovie={mov} />)}
                    </div>
        } 
      </div>
    </>
    );
}