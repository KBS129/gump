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
        <h3 className="mt-0 mb-5 text-3xl font-bold">{title}</h3>
        <p>Loading...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-16">
        <h3 className="mt-0 mb-5 text-3xl font-bold">{title}</h3>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </section>
    );
  }

  if (!moviesOnCategory.length) {
    return (
      <section className="mt-16">
        <h3 className="mt-0 mb-5 text-3xl font-bold">{title}</h3>
        <p>No movies available.</p>
      </section>
    );
  }

  return (
    <section className="[&+&]:mt-16">
  <h3 className="mt-0 mb-5 text-3xl font-bold">{title}</h3>

  <ul className="list-none px-10 flex gap-x-5 max-w-[100vw] overflow-x-auto scrollbar-hide -mx-10 ">
    {moviesOnCategory.map((movie) => (
      <li key={movie.id} className="min-w-[calc((100vw-80px-40px)/5)]">
        <MovieCard movie={movie} />
      </li>
    ))}
  </ul>
</section>

  );


}

export default MoviesList;
