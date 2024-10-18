import Link from 'next/link';
import Image from 'next/image';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  backdrop_path: string;
  title: string;
}

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="no-underline">
      <div className="relative w-full bg-white">
        <Image
          src={IMAGE_BASE_URL + movie.backdrop_path}
          alt={movie.title}
          width={500}
          height={280}
          className="w-full"
          layout="responsive"
        />
      </div>
      <h6 className="font-bold text-xl mb-0 mt-4">{movie.title}</h6>
    </Link>
  );
}

export default MovieCard;
