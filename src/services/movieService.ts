import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface FetchMoviesParams {
  query: string;
  page: number;
}

export async function fetchMovies({
  query,
  page,
}: FetchMoviesParams): Promise<MovieApiResponse> {
  const config = {
    params: { query, page },
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  };

  const response = await axios.get<MovieApiResponse>(API_URL, config);
  return response.data;
}
