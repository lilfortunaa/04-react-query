import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
interface FetchMoviesParams {
  query: string;
}

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies({
  query,
}: FetchMoviesParams): Promise<Movie[]> {
  const config = {
    params: { query },
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  };

  const response = await axios.get<FetchMoviesResponse>(API_URL, config);
  return response.data.results;
}
