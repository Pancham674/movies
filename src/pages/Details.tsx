import { getMovieDetails } from "../services/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { MovieInfo, SpokenLanguages } from "../MovieInfo";
import "../css/Details.css";

export default function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState<MovieInfo>();
    const [divBg, setDivBg] = useState("");
    const [error, setError] = useState("");
    const movId = Number(useParams().id);

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
                <>
                    <div className="details">
                        <img className="poster" src={movie!.poster_path ? 
                                imgPath + w500 + movie!.poster_path : noImageFound }>
                        </img>

                        <div className="general-info">
                            <legend className="movie-title"><b>{movie!.title}</b></legend>
                            { movie!.tagline && <h4 className="movie-subtitle"><i>"{movie!.tagline}"</i></h4> }
                            <br />
                            {/* add these two into a div contained within a gridso they can appear both next to eachother and under */}
                            <p>Status: {movie!.status}</p>
                            <p>Release Date: {getReleaseDate(movie!.release_date)}</p>
                            { movie!.runtime !== 0 && <p>Runtime: {`${Math.floor(movie!.runtime / 60)}H ${Number(movie!.runtime) % 60}`}M</p>}
                            { movie!.homepage && <a href={movie!.homepage} target="_blank">Homepage Link...</a> }
                            <br /> <br />
                            { movie!.budget !== 0 && <p>Budget: { movie!.budget.toLocaleString("en-US") }$</p> }
                            { movie!.revenue !== 0 && <p>Revenue: { movie!.revenue.toLocaleString("en-US") }$</p> }
                            { (movie!.budget !== 0 && movie!.revenue !== 0) && <p>Profit: { (movie!.revenue - movie!.budget).toLocaleString("en-US") }$</p> }
                            <br />
                            <fieldset>
                                <legend>Genres</legend>
                                    { movie!.genres.map(
                                        (gen, i) => <p key={i}><a href="#" className="tag" key={gen.id}>{gen.name}</a>,  </p>) }
                            </fieldset>
                        
                            <fieldset>
                                <legend>Production Companies:</legend>
                                { movie!.production_companies.map(
                                    comp => <img key={comp.id} src={imgPath + w200 + comp.logo_path} alt={comp.name}></img>) 
                                }
                            </fieldset>

                            <fieldset>
                                <legend>Production Countries:</legend>
                                { movie!.production_countries.map(
                                    (coun, i) => <p className="tag" key={i}>{coun.name}, </p>) }
                            </fieldset>

                            <fieldset>
                                <legend>Available Languages:</legend>
                                    { getLanguages(movie!.spoken_languages)}
                            </fieldset>
                            <br />
                        </div>

                        <div className="desc">
                            <h4>Description</h4>
                            <p>{movie!.overview}</p>
                        </div>

                    </div>   
                    <div style={{ backgroundImage: `url(${divBg})` }} /> {/*fix this*/}
                </>
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

    return langs.length != 0 ? langs.substring(0, langs.length - 2) : "none";
}