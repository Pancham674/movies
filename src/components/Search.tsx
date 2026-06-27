import { useMovieContext } from "../context/MovieContext";
import type { Genre, GenreItem } from "../MovieInfo";
import { useState, useEffect } from "react";
import GenreFilter from "./GenreFilter";
import "../css/GenreFilter.css"
import "../css/Search.css"

export default function Search({searchMoviesFunc, setSearchTermFunc, currentSearchTerm, genres}: {searchMoviesFunc: (e: any, g: GenreItem[]) => void, setSearchTermFunc: any, currentSearchTerm: string, genres: Genre[]}) {
    const { selectedGenreId } = useMovieContext();
    const [genreList, setGenreList] = useState<GenreItem[]>([])
    //this still gets set to true even though selectedGenreId is 0: click genre in Details and go to Popular Movies afterwards.
    const [isFiltersVisible, setIsFiltersVisible] = useState(selectedGenreId != 0);
    const [btnText, setBtnText] = useState(`${isFiltersVisible ? "hide" : "show"} filters`)

    function toggleFilters() {
        const isVisible = !isFiltersVisible;
        setIsFiltersVisible(isVisible);
        setBtnText(`${isVisible ? "hide" : "show"} filters`);
    }

    useEffect(() => { 
        const init: GenreItem[] = genres.map(g => ({
            id: g.id,
            name: g.name,
            isActive: g.id == selectedGenreId
        }));
        setGenreList(init);
    }, [genres])

    function handleGenreClicked(clickedGenre: Genre) {
        const genre = genreList.find(g => g.id === clickedGenre.id);
        setGenreList(prev => prev.map(g => ({
                    id: g.id,
                    name: g.name,
                    isActive: g.id == clickedGenre.id ?
                                !genre?.isActive : 
                                g.isActive
        })));
    }

    return (<>
            <form onSubmit={(e) => searchMoviesFunc(e, genreList)} className="search-form">
                <input type="text"
                    className="search-input"
                    placeholder="Search for movies..."
                    value={currentSearchTerm} 
                    onChange={(e) => setSearchTermFunc(e.target.value)}
                />
                
                <button type="submit"
                        className="search-button">
                        Search
                </button>
            </form>
            <div id="filters" className={`${!isFiltersVisible ? "hidden" : ""}`}>
                { genreList.map(g => 
                    <GenreFilter key={g.id} genre={g} handleGenreClicked={handleGenreClicked} isActive={(g.isActive)} />
                )}</div>
            <button className="toggleFilter" onClick={toggleFilters}>{btnText}</button>
        </>
    );
}