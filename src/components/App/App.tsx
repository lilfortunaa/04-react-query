import styles from "./App.module.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie, MovieApiResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<
    MovieApiResponse,
    Error
  >({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies({ query: searchQuery, page: currentPage }),
    enabled: !!searchQuery,
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Enter a valid search query.");
      return;
    }
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data && (
        <>
          {data.total_pages > 1 && (
            <Pagination
              pageCount={data.total_pages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelect} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
