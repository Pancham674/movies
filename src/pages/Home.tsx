import { getPopularMovies, getSearchedMovies, getMoviesWithGenre, changePage, getAllGenres } from "../services/api";
import type { Genre, MovieInfo, PageInfo } from "../MovieInfo";
import { useMovieContext } from "../context/MovieContext";
import PageButtons from "../components/PageButtons";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "../components/Search";
import "../css/Home.css";
import Filters from "../components/Filters";

export default function Home() {
    const { isLoading, setIsLoading } = useMovieContext();
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const genreId = Number(useParams().genreId)
    
    useEffect(() => {
            const loadAllGenres = async () => {
                try {
                    const gens: Genre[] = await getAllGenres();
                    setGenres(gens);                    
                } 
                catch (error: any) {
                    console.log(error);
                }
            }
            
            loadAllGenres();
    }, []);

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
        } catch(error: any) {
            console.log(error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (<>
        <div className="filter-container">
            <Search searchMoviesFunc={searchMovies}
                currentSearchTerm={searchTerm}
                setSearchTermFunc={setSearchTerm}
            />  
            <Filters genres={genres} />
        </div>

        { 
            error ? 
                <div className="error-message">{error}</div> :
                isLoading ?
                    <h3 className="loading">Hang on, we're still loading!</h3> :
                    movies.length == 0 ?
                        <p className="no-movies">No movies could be found.</p> :
                        <>
                            { !Number.isNaN(genreId) ? <p className="movie-genres">Movies with the genre <b>{ getFilteredGenres(genreId, genres) }</b>:</p> : ""}
                            <div className="movies-grid">{
                                movies.map(mov => <MovieCard key={mov.id} currentMovie={mov} />)}
                            </div>
                            <PageButtons handlePageChange={handlePageChange} currentPageNum={pageInfo!.current} maxPageNum={pageInfo!.totalPages} />
                        </>
        } 
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