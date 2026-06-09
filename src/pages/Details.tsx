import { useMovieContext } from "../context/MovieContext";
import { getMovieDetails } from "../services/api";
import { useParams } from "react-router-dom";
import type MovieInfo from "../MovieInfo";
import { useState, useEffect } from "react";

export default function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState<MovieInfo>();
    const { error, setError } = useMovieContext();
    const movId = Number(useParams().id);

    //Refetch the info everytime movId changes (basically everytime Details gets viewed)
    useEffect(() => {
        async function loadMovieDetails() {
            try {
                const mov: MovieInfo = await getMovieDetails(movId);
                setMovie(mov);
            } catch (error) {
                console.log(error);
                setError("An Error occurred trying to fetch details of the movie");
            } finally {
                setIsLoading(false);
            }
        }
        loadMovieDetails();
    }, [movId])

    return (<>
        { error && <div className="error-message">{error}</div> }
        {
            isLoading ? 
            <p>Loading!!</p> :
            <div>
                <h2 className="movie-title">{movie!.title}</h2>
                { movie!.tagline && <h3 className="movie-subtitle">{movie!.tagline}</h3> }
                <fieldset>
                    <legend>General Information</legend>
                    <fieldset>
                        <legend>Genres</legend>
                        <ul>
                            { movie!.genres.map(
                                gen => <li key={gen.id}>{gen.name}</li>) }
                        </ul>
                    </fieldset>
                    <p>Release Date: {movie!.release_date.toLocaleLowerCase()}</p>
                    <p>Runtime: {`${Math.round(Number(movie!.runtime) / 60)}H ${Number(movie!.runtime) % 60}`}M</p>
                    { movie!.homepage && <a href={movie!.homepage} target="_blank">Homepage Link...</a> }
                    <ul>Production Countries:
                        { movie!.production_countries.map(
                            (country, i) => <li key={i}>{country.iso_3166_1}: {country.name}</li>) }
                    </ul>
                    <p>Revenue: {movie!.revenue.toLocaleString("en-US")}$</p>
                </fieldset> 

                <fieldset>
                    <legend>Description</legend>
                    <p>{movie!.overview}</p>
                </fieldset>
            </div>
        }
    </>)
}