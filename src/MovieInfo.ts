export default interface MovieInfo {
  id: number, 
  title: string, 
  status: string,
  budget: number,
  revenue: number,
  runtime: number,
  tagline: string,
  overview: string,
  genres: Genres[],
  homepage: string,
  poster_path: string, 
  release_date: string,
  backdrop_path: string,
  spoken_languages: SpokenLanguages[],
  production_countries: ProductionCountries[],
  production_companies: ProductionCompanies[],
}

 interface ProductionCountries {
  iso_3166_1: string,
  name: string
}

interface Genres {
  name: string
  id: number,
}

interface SpokenLanguages {
  english_name: string,
  iso_639_1: string,
  name: string,
}

interface ProductionCompanies {
  origin_country: string,
  logo_path: string,
  name: string,
  id: number,
}