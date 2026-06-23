import { useState, useEffect } from "react";
import type { Genre } from "../MovieInfo";
import "../css/Filter.css"

export default function Filters({genres}: {genres: Genre[]}) {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [genreList, setGenreList] = useState<GenreList[]>([])
    const [btnText, setBtnText] = useState("show filters")

    function toggleFilters() {
        const isVisible = !isFiltersVisible;
        setIsFiltersVisible(isVisible);
        setBtnText(isVisible ? "hide filters" : "show filters");
        //ok so how do i actually use these for the search?
        //shouldnt this be in Search instead of Home? grr....... 
    }

    useEffect(() => { 
        const init: GenreList[] = genres.map(g => ({
            id: g.id,
            isActive: false
        }));
        setGenreList(init);
    }, [genres])

    function tagClicked(clickedGenre: Genre) {
        const genre = genreList.find(g => g.id === clickedGenre.id);
        setGenreList(prev => prev.map(g => ({
                    id: g.id,
                    isActive: g.id == clickedGenre.id ?
                                !genre?.isActive : 
                                g.isActive
        })));
    }
    
    return (<>
        <div id="filters" className={`${!isFiltersVisible ? "hidden" : ""}`}>
            { genres.map(g => 
                <button key={g.id}
                onClick={() => tagClicked(g)}
                className={`genre-tag
                    ${genreList.find(gItem => gItem.id === g.id)?.isActive ?
                        "active":
                        ""
                    }`}>
                        {g.name}
                </button>
            )}
        </div>
        <button onClick={toggleFilters}>{btnText}</button>
    </>);
} 

interface GenreList {
    id: number;
    isActive: boolean
}