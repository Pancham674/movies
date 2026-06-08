import { createContext, useState, useContext, useEffect } from "react";
import type MovieInfo from "../MovieInfo";

interface MovieContextType {
    favMovies: MovieInfo[],
    addToFavs: (movie: MovieInfo) => void,
    removeFromFavs: (movId: number) => void,
    isFavorite: (movId: number) => boolean
}

const MovieContext = createContext<MovieContextType>(null!);

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
    const [favMovies, setFavMovies] = useState<MovieInfo[]>([]);
    
    //retrieve the favMovies from localStorage on the first load
    useEffect(() => {
        const storedFavs = localStorage.getItem("favMovies");
        if (storedFavs) {
            const favs: MovieInfo[] = JSON.parse(storedFavs);
            setFavMovies(favs);
        }
    }, []);

    //everytime a value within favMovies change we update the localStorage
    useEffect(() =>{
        localStorage.setItem("favMovies", JSON.stringify(favMovies))
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
        favMovies,
        addToFavs,
        removeFromFavs,
        isFavorite
    }

    return (
    <MovieContext.Provider value={values}>
        {children}
    </MovieContext.Provider>)
}