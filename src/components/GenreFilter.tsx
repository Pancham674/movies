import type { Genre } from "../MovieInfo";

export default function GenreFilter({genre, handleGenreClicked, isActive}: {genre: Genre, handleGenreClicked: (g: Genre) => void, isActive: boolean}) {
    return (<>
        <button key={genre.id}
            onClick={() => handleGenreClicked(genre)}
            className={`genre-tag${isActive ?
                    " active":
                    ""
                }`}>
            {genre.name}
        </button>
    </>);
}