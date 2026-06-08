const API_KEY = "?api_key=7770a465a168d8c734f309672b4b4aea";
const BASE_URL = "https://api.themoviedb.org/3/";

export const getPopularMovies = async () =>  {
    const response = await fetch(`${BASE_URL}movie/popular${API_KEY}`);
    if (!response.ok) {
        throw new Error();
    }
    const data = await response.json();
    return data.results;
}


export const getSearchedMovies = async (searchTerm: string) =>  {
    const response = await fetch(`${BASE_URL}search/movie${API_KEY}&query=${
        encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data.results;
}