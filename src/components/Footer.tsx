import "../css/Footer.css"

export default function Footer () {
    return (
        <div className="footer">
            <p>@Pancham674, made with <a href="https://developer.themoviedb.org/docs/getting-started" target="_blank">TMDB API</a> 2026-{new Date().getFullYear()}</p>
            <a href="https://www.github.com/Pancham674/movies" target="_blank">Project repository...</a>
        </div>
    );
}