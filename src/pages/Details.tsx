import { getMovieDetails } from "../services/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type MovieInfo from "../MovieInfo";

export default function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState<MovieInfo>();
    const [error, setError] = useState("");;
    const movId = Number(useParams().id);

    //Refetch the info everytime movId changes (basically everytime Details gets viewed)
    useEffect(() => {
        async function loadMovieDetails() {
            try {
                const mov: MovieInfo = await getMovieDetails(movId);
                setMovie(mov);
            } catch (error: any) {
                console.log(error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
        loadMovieDetails();
    }, [movId])

    return (<>
        {
        error ?
        <div className="error-message">{error}</div> :
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
                   
                    <p>Release Date: {getReleaseDate(movie!.release_date)}</p>
                    <p>Status: {movie!.status}</p>
                    <p>Runtime: {`${Math.floor(Number(movie!.runtime) / 60)}H ${Number(movie!.runtime) % 60}`}M</p>
                   
                    { movie!.homepage && <a href={movie!.homepage} target="_blank">Homepage Link...</a> }
                   
                    <ul>Production Countries:
                        { movie!.production_countries.map(
                            (country, i) => <li key={i}>{country.iso_3166_1}: {country.name}</li>) }
                    </ul>
                    <ul>Available Languages:
                        { movie!.spoken_languages.map(
                            (lang, i) => <li key={i}>{lang.english_name}</li>) }
                    </ul>

                    { movie!.budget !== 0 && <p>Budget: { movie!.budget.toLocaleString("en-US") }$</p> }
                    { movie!.revenue !== 0 && <p>Revenue: { movie!.revenue.toLocaleString("en-US") }$</p> }
                    { (movie!.budget !== 0 && movie!.revenue !== 0) && <p>Profit: { (movie!.revenue - movie!.budget).toLocaleString("en-US") }$</p> }
                </fieldset> 

                <fieldset>
                    <legend>Description</legend>
                    <p>{movie!.overview}</p>
                </fieldset>
            </div>
        }
    </>)
}

function getReleaseDate(stringDate: string): string {
    const dateArray = stringDate.split("-");
    const correctOrder = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
    return correctOrder;
}