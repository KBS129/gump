"use client"; 

import { useQuery } from '@tanstack/react-query';
import { getMoviesOnCategory, Movie } from '../api/tmdb.api';
import MovieCard from './MovieCard';

interface MoviesListProps {
  title: string;
  category: string;
}

function MoviesList({ title, category }: MoviesListProps) {
  const { data: moviesOnCategory = [], isLoading, isError, error } = useQuery<Movie[]>({
    queryKey: ['movies', category],
    queryFn: () => getMoviesOnCategory(category),
  });

  if (isLoading) {
    return (
      <section className="mt-16">
        <h3 className="mt-0 mb-5 text-2xl sm:text-3xl font-bold">{title}</h3>
        <p className="text-lg">Loading...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-16">
        <h3 className="mt-0 mb-5 text-2xl sm:text-3xl font-bold">{title}</h3>
        <p className="text-lg">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </section>
    );
  }

  if (!moviesOnCategory.length) {
    return (
      <section className="mt-16">
        <h3 className="mt-0 mb-5 text-2xl sm:text-3xl font-bold">{title}</h3>
        <p className="text-lg">No movies available.</p>
      </section>
    );
  }

  return (
    <section className="[&+&]:mt-16">
      <h3 className="mt-0 mb-5 text-2xl sm:text-3xl font-bold mx-5">{title}</h3>

      <ul className="list-none mx-5 flex gap-x-5 overflow-x-auto scrollbar-hide ">
        {moviesOnCategory.map((movie) => (
          <li key={movie.id} className="flex-shrink-0 w-[calc((100vw-30px)/2)] sm:w-[calc((100vw-80px)/5)]">
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MoviesList;
