import { getPopularMovies, getSearchedMovies } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import Search from "../components/Search";

export default function Home() {
    const { movies, setMovies, isLoading, setIsLoading, error, setError } = useMovieContext();
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
            const loadPopularMovies = async () => {
                try {
                    const popularMovies = await getPopularMovies();
                    setMovies(popularMovies);
                } catch (er) {
                    console.log(er);
                    setError("RAHHHH!!! WE FAILED GETTING THE POPULAR MOVIES, MASTER");
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
        } catch(er) {
            console.log(er);
            setError("RAHHHH!!! WE FAILED GETTING THE MOVIES YOU SEARCHED FOR, MASTER");
        } finally {
            setIsLoading(false);
        }
    }

    return (<>
      <div className="Home">      
        <Search searchMoviesFunc={searchMovies}
              currentSearchTerm={searchTerm}
              setSearchTermFunc={setSearchTerm}/>
        
        { error && <div className="error-message">{error}</div> }

        { 
            isLoading ? <h3 className="loading">Hang on, we're still loading!</h3> :
            <div className="movies-grid">{
                movies.map(mov => <MovieCard key={mov.id} currentMovie={mov} />)}
            </div>
        } 
      </div>
    </>
    );
}