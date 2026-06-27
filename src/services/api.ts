import type { MovieInfo, PageInfo, GenreItem } from "../MovieInfo";

const API_KEY = "api_key=7770a465a168d8c734f309672b4b4aea";
const BASE_URL = "https://api.themoviedb.org/3";
let wasLastCallFilteredSearch = false;
let matchedPages: any[];

export const getPopularMovies = async () =>  {
    const URL = `${BASE_URL}/movie/popular?${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }
    
    const fullData: FullData = {
        results: data.results,
        pageInfo: {
            current: data.page,
            totalPages: data.total_pages < 500 ? data.total_pages : 500,
            url: URL
        }
    }
    
    return fullData;
}

export const getSearchedMovies = async (searchTerm: string, genreList: GenreItem[]) => {
    const sdURL = `${BASE_URL}/search/movie?${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    let searchedData: JsonResponse;
    
    let selectedGenres = genreList.filter(g => g.isActive);
    const fdURL = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${selectedGenres.map(g => g.id)}`;
    let filteredData: JsonResponse = {
        results: [] as any[],
        page: 0,
        total_pages: 0,
        status_message: ""  
    };
    
    let usedURL = "";
    let matchedData: JsonResponse = {
        results: [] as any[],
        page: 0,
        total_pages: 0,
        status_message: ""  
    };
    wasLastCallFilteredSearch = false;
    
    if (searchTerm && selectedGenres.length > 0){           //user wants to search and filter
        usedURL = "";
        matchedPages = [[]];
        matchedData.page = 1;
        wasLastCallFilteredSearch = true;
        
        let pages = 0;               //page index
        let matches = 0;             //captures the amount of matched results to create pages
        let movieCount = 0;
        filteredData.results = await getMoreResults(fdURL);
        
        //iterate through both data to get movies that are contained in both
        filteredData.results.forEach((filterPage: any[]) => {
            filterPage.forEach((filterMov: MovieInfo) => {
                //movies should have ALL selectedGenres
                //prevent movie from appearing multiple times
                movieCount++;
                if (filterMov.title.toLocaleLowerCase().includes(searchTerm)) {
                    if (matches > 0 && matches % 20 == 0){
                        pages++;
                        matchedPages.push([]);
                    }
                    matches++;
                    matchedPages[pages].push(filterMov);
                }
            });
        });
        
        matchedData.total_pages = matchedPages.length
        matchedData.results = matchedPages.length == 0 ? [] : matchedPages[0];
        
    } else if (searchTerm) {                            //user wants to only search
        const response = await fetch(sdURL);
        searchedData = await response.json();
        
        if (!response.ok) {
            const message = `Error Code ${response.status}: ${searchedData!.status_message}`;
            throw new Error(message);
        }
        usedURL = sdURL;
        matchedData = searchedData!;
    }
    else if (selectedGenres.length > 0){                //user wants to only filter
        const response = await fetch(fdURL);
        filteredData = await response.json();
        
        if (!response.ok) {
            const message = `Error Code ${response.status}: ${filteredData!.status_message}`;
            throw new Error(message);
        }
        usedURL = fdURL;
        matchedData = filteredData!;
    }
    
    const fullData: FullData = {
        results: matchedData.results,
        pageInfo: {
            current: matchedData.page,
            totalPages: matchedData.total_pages < 500 ? matchedData.total_pages : 500,
            url: usedURL
        }
    }

    return fullData;
}

async function getMoreResults(url: string) {
    let results = [];
    let pageLimit = 20;

    for (let i = 1; i < pageLimit +1; i++) {
        const response = await fetch(`${url}&page=${i}`);
        const data = await response.json();
        
        if (!response.ok) {
            const message = `Error Code ${response.status}: ${data!.status_message}`;
            throw new Error(message);
        }

        //if the result conains less than 20 (max movie per pages) then cancel the loop early
        pageLimit = data.results.length < 20 ? i : pageLimit;
        results.push(data.results);
    }

    return results;
}

export const getMovieDetails = async (movieId: number) => {
    const URL = `${BASE_URL}/movie/${movieId}?${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!response.ok) {
        const message = `Error Code ${response.status}: ${data.status_message}`;
        throw new Error(message);
    }

    wasLastCallFilteredSearch = false;
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
    
    wasLastCallFilteredSearch = false;
    const fullData: FullData = {
        results: data.results,
        pageInfo: {
            current: data.page,
            totalPages: data.total_pages < 500 ? data.total_pages : 500,
            url: URL
        }
    }
    
    return fullData;
}

export async function changePage(pageInfo: PageInfo) {
    let fullData: FullData;
    if (wasLastCallFilteredSearch) {
        fullData = {
            results: matchedPages[pageInfo.current-1],
            pageInfo: {
                current: pageInfo.current,
                totalPages: matchedPages.length,
                url: ""
            }
        }
    } else { 
        const URL = `${pageInfo.url}&page=${pageInfo.current}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (!response.ok) {
            const message = `Error Code ${response.status}: ${data.status_message}`;
            throw new Error(message);
        }
        
        fullData = {
            results: data.results,
            pageInfo: {
                current: data.page,
                totalPages: data.total_pages < 500 ? data.total_pages : 500,
                url: URL
            }
        }
    }

    return fullData;
}

interface FullData {
    results: MovieInfo[],
    pageInfo: PageInfo
}

interface JsonResponse {
    results: any[],
    page: number;
    total_pages: number,
    status_message: string
}