import { getPopularMovies, getSearchedMovies, getMoviesWithGenre } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import type { Genre, MovieInfo } from "../MovieInfo";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "../components/Search";

export default function Home() {
    const { isLoading, setIsLoading, genres } = useMovieContext();
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const genreId = Number(useParams().genreId)

    useEffect(() => {
            async function loadPopularMovies() {
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

            async function loadMoviesWithGenre(genreId: number){
                try {
                    const moviesWithGenres = await getMoviesWithGenre(genreId);
                    setMovies(moviesWithGenres);
                } catch (error: any) {
                    console.log(error);
                    setError(error.message);
                } finally{
                    setIsLoading(false);
                }
            }

            if (genreId)
            {
                loadMoviesWithGenre(genreId);
            } else {
                loadPopularMovies();
            }

        }, [genreId]
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
                    <p className="no-movies">No movies could be found.</p> :
                    <>
                        { !Number.isNaN(genreId) ? <p>Movies with the genre { getFilteredGenres(genreId, genres) }:</p> : ""}
                        <div className="movies-grid">{
                            movies.map(mov => <MovieCard key={mov.id} currentMovie={mov} />)}
                        </div>
                    </>
        } 
      </div>
    </>
    );
}

function getFilteredGenres(genreId: number, genres: Genre[]) {
    let filteresGenStr = "";
    const filteredGenArr = genres.filter(g => g.id === genreId);

    filteredGenArr.forEach(g => {
        filteresGenStr += `${g.name}, `;
    })

    return filteresGenStr.substring(0, filteresGenStr.length - 2);
}