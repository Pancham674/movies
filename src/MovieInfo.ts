export default interface MovieInfo {
  id: number, 
  title: string, 
  revenue: number,
  runtime: string,
  tagline: string,
  overview: string,
  genres: Genres[],
  homepage: string,
  poster_path: string, 
  release_date: string,
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