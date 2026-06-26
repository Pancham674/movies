import type { MovieInfo, PageInfo, GenreItem } from "../MovieInfo";

const API_KEY = "api_key=7770a465a168d8c734f309672b4b4aea";
const BASE_URL = "https://api.themoviedb.org/3";
let wasLastCallFilteredSearch = false;
let matchedPages: any[];

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
    let sdURL = "";              //url for seachedData
    let searchedData: JsonResponse | undefined = undefined;
    
    let fdURL = "";              //url for filteredData
    let filteredData: JsonResponse | undefined = undefined;
    
    let usedURL = "";
    let matchedData: JsonResponse = {
        results: [] as any[],
        page: 0,
        total_pages: 0,
        status_message: ""  
    };
    matchedPages = [[]];

    if (searchTerm){
        sdURL = `${BASE_URL}/search/movie?${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(sdURL);
        searchedData = await response.json();

        if (!response.ok) {
            const message = `Error Code ${response.status}: ${searchedData!.status_message}`;
            throw new Error(message);
        }
    }

    let selectedGenres = genreList.filter(g => g.isActive);
    if (selectedGenres.length > 0){
        fdURL = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${selectedGenres.map(g => g.id)}`;
        const response = await fetch(fdURL);
        filteredData = await response.json();

        if (!response.ok) {
            const message = `Error Code ${response.status}: ${filteredData!.status_message}`;
            throw new Error(message);
        }
    }

    wasLastCallFilteredSearch = false;
    if (searchedData && filteredData) {
        usedURL = "";
        matchedData.page = 1;
        wasLastCallFilteredSearch = true;

        searchedData.results = await getMoreResults(sdURL, searchedData.total_pages);
        filteredData.results = await getMoreResults(fdURL, filteredData.total_pages);
        
        let matches = 0;             //captures the amount of matched results to create pages
        
        //iterate through both data to get movies that are contained in both
        searchedData.results.forEach((searchPage: any[]) => {
            searchPage.forEach((searchMov: any) => {
                filteredData.results.forEach((filterPage: any[]) => {
                    if (filterPage.find(filterMov => filterMov.id == searchMov.id)) {
                        if (matches > 0 && matches % 20 == 0){
                            matchedPages.push([]);
                        }
                        matchedPages[matches].push(searchMov);
                    }
                });
            });
        });

        matchedData.total_pages = matchedPages.length
        matchedData.results = matchedPages.length == 0 ? [] : matchedPages[0];
    }
    else if (searchedData) {
        usedURL = sdURL;
        matchedData = searchedData;
    } 
    else if (filteredData) {
        usedURL = fdURL;
        matchedData = filteredData;
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

async function getMoreResults(url: string, maxPage: number) {
    let results = [];
    const pageLimit = maxPage > 6 ? 6 : maxPage;

    for (let i = 1; i < pageLimit; i++) {
        const response = await fetch(`${url}&page=${i}`);
        const data = await response.json();
        
        if (!response.ok) {
            const message = `Error Code ${response.status}: ${data!.status_message}`;
            throw new Error(message);
        }

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