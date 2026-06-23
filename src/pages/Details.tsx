import type { MovieInfo, SpokenLanguages } from "../MovieInfo";
import { useMovieContext } from "../context/MovieContext";  
import { getMovieDetails } from "../services/api";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Details.css";

export default function Details() {
    const { isFavorite, addToFavs, removeFromFavs } = useMovieContext();
    const [isAnyInfoAvailable , setisAnyInfoAvailable] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [movie, setMovie] = useState<MovieInfo>();
    const [divBg, setDivBg] = useState("");
    const [error, setError] = useState("");

    const movId = Number(useParams().id);
    const isCurrentFavorite = isFavorite(movId);

    const favoriteMovie = (e: any) => {
        e.preventDefault();
        isCurrentFavorite ? removeFromFavs(movId) : movie ? addToFavs(movie) : null;
    }

    const noImageFound = "https://ih1.redbubble.net/image.4905811447.8675/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";
    const imgPath = "https://image.tmdb.org/t/p/";
    const w500 = "w500";
    const w200 = "w200";
    const og = "original";

    //Refetch the info everytime movId changes (basically everytime Details gets viewed)
    useEffect(() => {
        async function loadMovieDetails() {
            try {
                const mov: MovieInfo = await getMovieDetails(movId);
                setMovie(mov);

                const bgImgDiv = mov!.backdrop_path ? imgPath + og + mov!.backdrop_path : "";
                setDivBg(bgImgDiv);

                if (!mov.overview && mov.budget == 0 && mov.revenue == 0 && !mov.homepage && mov.genres.length == 0 &&
                     mov.production_companies.length == 0 && mov.production_countries.length == 0 && mov.spoken_languages.length == 0){
                    setisAnyInfoAvailable(false);
                }
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
                <div className="Details">
                    <div className="bg" style={{ backgroundImage: `url(${divBg})` }} />
                    <div className="details">
                        <img className="poster"
                            src={movie!.poster_path ? 
                                imgPath + w500 + movie!.poster_path : noImageFound }>
                        </img>

                        <div className="general-info">
                            <legend className="movie-title"><b>{movie!.title}</b></legend>
                            { movie!.tagline && <h4 className="movie-subtitle"><i>"{movie!.tagline}"</i></h4> }
                            <button className={`favorite-btn ${isCurrentFavorite ? "active" : ""}`} onClick={favoriteMovie}>♥</button>

                            <br />
                            <div className="other-info">
                                <div>
                                    { movie!.status && <p>Status: {movie!.status}</p> }
                                    { movie!.release_date && <p>Release Date: {getReleaseDate(movie!.release_date)}</p>}
                                    { movie!.runtime !== 0 && <p>Runtime: {`${Math.floor(movie!.runtime / 60)}H ${Number(movie!.runtime) % 60}`}M</p>}
                                </div>
                                <div>
                                    { movie!.budget !== 0 && <p>Budget: { movie!.budget.toLocaleString("en-US") }$</p> }
                                    { movie!.revenue !== 0 && <p>Revenue: { movie!.revenue.toLocaleString("en-US") }$</p> }
                                    { (movie!.budget !== 0 && movie!.revenue !== 0) && <p>Profit: { (movie!.revenue - movie!.budget).toLocaleString("en-US") }$</p> }
                                </div>
                            </div>

                            { movie!.homepage && <a href={movie!.homepage} target="_blank">Homepage Link...</a> }
                            
                            {
                                movie!.genres.length > 0 &&
                                <fieldset>
                                    <legend>Genres</legend>
                                        { movie!.genres.map(
                                            (gen, i) => <p key={i}><Link to={`/genres/${gen.id}`} className="tag" key={gen.id}>{gen.name}</Link>,  </p>) }
                                </fieldset>
                            }

                            {
                                movie!.production_companies.length > 0 && 
                                <fieldset>
                                    <legend>Production Companies:</legend>
                                    { movie!.production_companies.map(
                                        comp => comp.logo_path ?
                                                <img key={comp.id} src={imgPath + w200 + comp.logo_path}></img> :
                                                <p>{comp.name}</p>) 
                                    }
                                </fieldset>
                            }

                            {
                                movie!.production_countries.length > 0 && 
                                <fieldset>
                                    <legend>Production Countries:</legend>
                                    { movie!.production_countries.map(
                                        (coun, i) => <p className="tag" key={i}>{coun.name}, </p>) }
                                </fieldset>
                            }

                            {
                                movie!.spoken_languages.length > 0 && 
                                <fieldset>
                                    <legend>Available Languages:</legend>
                                        <p>{ getLanguages(movie!.spoken_languages) }</p>
                                </fieldset>
                            }
                        </div>

                        <div className="desc">
                            <h4>Description</h4>
                            <p>{movie!.overview ?
                                    movie!.overview :
                                    isAnyInfoAvailable ?
                                        "No description available." :
                                        "Hey TMDB, gimme a movie with NO relevant information!!!"}
                            </p>
                        </div>   
                    </div>
                </div>
        }
    </>)
}

function getReleaseDate(stringDate: string): string {
    const dateArray = stringDate.split("-");
    const correctOrder = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
    return correctOrder;
}

function getLanguages(languagesArray: SpokenLanguages[]): string {
    let langs = "";

    languagesArray.forEach(lang => {
        langs += `${lang.english_name}, `
    });

    return langs.substring(0, langs.length - 2);
}