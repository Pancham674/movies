import { getPopularMovies, getSearchedMovies, getMoviesWithGenre, changePage } from "../services/api";
import type { Genre, MovieInfo, PageInfo } from "../MovieInfo";
import { useMovieContext } from "../context/MovieContext";
import PageButtons from "../components/PageButtons";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "../components/Search";
import "../css/Home.css";

export default function Home() {
    const { isLoading, setIsLoading, genres } = useMovieContext();
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const genreId = Number(useParams().genreId)

    useEffect(() => {
            async function loadPopularMovies() {
                try {
                    const fullData = await getPopularMovies();

                    setMovies(fullData.results);
                    setPageInfo(fullData.pageInfo);
                } catch (error: any) {
                    console.log(error);
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }

            async function loadMoviesWithGenre(genreId: number){
                try {
                    const fullData = await getMoviesWithGenre(genreId);
                    
                    setMovies(fullData.results);
                    setPageInfo(fullData.pageInfo);
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
    
    const handlePageChange = async (toPageNum: number) => {
        if (toPageNum <= 0 || toPageNum > pageInfo!.totalPages) {
            return;
        }

        const newInfo = { ...pageInfo!, current: toPageNum };
        try {
            const fullData = await changePage(newInfo);
            setMovies(fullData.results);
            setPageInfo(newInfo);
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
    };

    const searchMovies = async (e: MouseEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || isLoading) { return; }
        setIsLoading(true);

        try {
            const fullData = await getSearchedMovies(searchTerm);

            setMovies(fullData.results);
            setPageInfo(fullData.pageInfo);
            
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
                        <PageButtons handlePageChange={handlePageChange} currentPageNum={pageInfo!.current} maxPageNum={pageInfo!.totalPages} />
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