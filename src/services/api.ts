const API_KEY = "?api_key=7770a465a168d8c734f309672b4b4aea";
const BASE_URL = "https://api.themoviedb.org/3/";

export const getPopularMovies = async () =>  {
    const URL = `${BASE_URL}movie/popular${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }
    
    return data.results;
}

export const getSearchedMovies = async (searchTerm: string) => {
    const URL = `${BASE_URL}search/movie${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }
    
    return data.results;
}

export const getMovieDetails = async (movieId: number) => {
    const URL = `${BASE_URL}/movie/${movieId}${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }

    return data;
}