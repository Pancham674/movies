import { createContext, useState, useContext, useEffect, type SetStateAction } from "react";
import type MovieInfo from "../MovieInfo";

interface MovieContextType {
    favMovies: MovieInfo[],
    addToFavs: (movie: MovieInfo) => void,
    removeFromFavs: (movId: number) => void,
    isFavorite: (movId: number) => boolean,
    isLoading: boolean,
    setIsLoading: React.Dispatch<SetStateAction<boolean>>, 
    error: string,
    setError: React.Dispatch<SetStateAction<string>>
}

const MovieContext = createContext<MovieContextType>(null!);

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
    const [favMovies, setFavMovies] = useState<MovieInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(true);
    const [error, setError] = useState("");

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
        isLoading, setIsLoading,
        error, setError
    }

    return (
    <MovieContext.Provider value={values}>
        {children}
    </MovieContext.Provider>)
}