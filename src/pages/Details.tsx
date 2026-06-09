import { useMovieContext } from "../context/MovieContext";
import { useParams } from "react-router-dom";
import type MovieInfo from "../MovieInfo";

export default function Details() {
    const { movies } = useMovieContext();
    const movId = Number(useParams().id);

    const currentMov: MovieInfo = movies.find(mov => mov.id == movId)!;

    return (
        currentMov ?
        <p>We got the movie {currentMov.title}, ya dingut</p> :
        <p>Something went wrong while getting the movie with the id {movId}</p>
    )
}