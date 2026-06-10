export default interface MovieInfo {
  id: number, 
  title: string, 
  status: string,
  budget: number,
  revenue: number,
  runtime: string,
  tagline: string,
  overview: string,
  genres: Genres[],
  homepage: string,
  poster_path: string, 
  release_date: string,
  spoken_languages: SpokenLanguages[],
  production_countries: ProductionCountries[],
}

 interface ProductionCountries {
  iso_3166_1: string,
  name: string
}

interface Genres {
  id: number,
  name: string
}

interface SpokenLanguages {
  english_name: string,
  iso_639_1: string,
  name: string,
}