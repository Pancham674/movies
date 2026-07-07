import { createContext, useState, useContext, useEffect, type SetStateAction } from "react";
import type { GenreItem, MovieInfo } from "../MovieInfo";

interface MovieContextType {
    favMovies: MovieInfo[],
    addToFavs: (movie: MovieInfo) => void,
    removeFromFavs: (movId: number) => void,
    isFavorite: (movId: number) => boolean,
    selectedGenres: GenreItem[],
    setSelectedGenres: React.Dispatch<SetStateAction<GenreItem[]>>,
}

const MovieContext = createContext<MovieContextType>(null!);

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
    const [selectedGenres, setSelectedGenres] = useState<GenreItem[]>([]);
    const [favMovies, setFavMovies] = useState<MovieInfo[]>([]);
    const [isInit, setIsInit] = useState(true);

    //retrieve the favMovies from localStorage on the first load
    useEffect(() => {
        const storedFavs = localStorage.getItem("favMovies");
        if (storedFavs) {
            const favs: MovieInfo[] = JSON.parse(storedFavs);
            setFavMovies(favs);
        }
        setIsInit(false);
    }, []);

    //everytime a value within favMovies change we update the localStorage
    useEffect(() => {
        if (!isInit)    //prevent setting it to [] on first init
        {
            localStorage.setItem("favMovies", JSON.stringify(favMovies))
        }
    }, [favMovies]);

    const addToFavs = (movie: MovieInfo) => {
        setFavMovies([...favMovies, movie]);
    }

    const removeFromFavs = (movId: number) => {
        setFavMovies(favMovies.filter(fav => fav.id !== movId));
    }

    const isFavorite = (movId: number) => {
        return favMovies.some(fav => fav.id === movId);
    }

    const values: MovieContextType = {
        favMovies, addToFavs, removeFromFavs, isFavorite, 
        selectedGenres, setSelectedGenres
    }

    return (
    <MovieContext.Provider value={values}>
        {children}
    </MovieContext.Provider>)
}