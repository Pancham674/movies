import { getPopularMovies, getSearchedMovies, getMoviesWithGenre, changePage, getAllGenres } from "../services/api";
import type { Genre, GenreItem, MovieInfo, PageInfo } from "../MovieInfo";
import { useMovieContext } from "../context/MovieContext";
import PageButtons from "../components/PageButtons";
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import Search from "../components/Search";
import "../css/Home.css";

export default function Home() {
    const { isLoading, setIsLoading, selectedGenreId } = useMovieContext();
    const [movies, setMovies] = useState<MovieInfo[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    
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
             
            if (selectedGenreId > 0) {
                loadMoviesWithGenre(selectedGenreId);
            } else {
                loadPopularMovies();
            }
            
        }, [selectedGenreId]
    );
    
    const handlePageChange = async (toPageNum: number) => {
        if (toPageNum <= 0 || toPageNum > pageInfo!.totalPages || pageInfo!.current == toPageNum) {
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

    const searchMovies = async (e: MouseEvent, genreList: GenreItem[]) => {
        e.preventDefault();
        if ((!searchTerm.trim() && !genreList.find(g => g.isActive)) || isLoading) { return; }
        setIsLoading(true);

        try {
            const fullData = await getSearchedMovies(searchTerm, genreList);

            setError("");
            setMovies(fullData.results);
            setPageInfo(fullData.pageInfo);
            // setGenres(genreList.filter(g => g.isActive).map(g => g.id));
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
                setSearchTermFunc={setSearchTerm}
                currentSearchTerm={searchTerm}
                genres={genres}
            />  
        </div>

        { 
            error ? 
                <div className="error-message">{error}</div> :
                isLoading ?
                    <h3 className="loading">Hang on, we're still loading!</h3> :
                    movies.length == 0 ?
                        <p className="no-movies">No movies could be found.</p> :
                        <>
                            <div className="movies-grid">{
                                movies.map(mov => <MovieCard key={mov.id} currentMovie={mov} />)}
                            </div>
                            <PageButtons handlePageChange={handlePageChange} currentPageNum={pageInfo!.current} maxPageNum={pageInfo!.totalPages} />
                        </>
        } 
        </>
    );
}