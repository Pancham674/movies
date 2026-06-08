import { getPopularMovies, getSearchedMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import type MovieInfo from "../MovieInfo";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    
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
                movies.map(mov => mov.title.includes(searchTerm)
                    && <MovieCard key={mov.id} currentMovie={mov} />)}
            </div>
        } 
      </div>
    </>
    );
}