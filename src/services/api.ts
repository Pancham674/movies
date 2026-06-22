const API_KEY = "api_key=7770a465a168d8c734f309672b4b4aea";
const BASE_URL = "https://api.themoviedb.org/3";
//add pages: add useState that keeps track of page number and reset it if the context/query changes
//when when adding genre to filter in the search make it possible to search for multiple
// add a filter(confirm) and reset button. Perhabs a dropdown to filter too
//i have to make it so instead of one, you can search for multiple (its currently only one)

export const getPopularMovies = async () =>  {
    const URL = `${BASE_URL}/movie/popular?${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }
    
    return data.results;
}

export const getSearchedMovies = async (searchTerm: string) => {
    const URL = `${BASE_URL}/search/movie?${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }
    
    return data.results;
}

export const getMovieDetails = async (movieId: number) => {
    const URL = `${BASE_URL}/movie/${movieId}?${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }

    return data;
}

export const getAllGenres = async () => {
    const URL = `${BASE_URL}/genre/movie/list?${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }

    return data.genres;
}

export const getMoviesWithGenre = async (genreId: number) => {
    const URL = `${BASE_URL}/discover/movie?with_genres=${genreId}&${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }

    return data.results;
}

