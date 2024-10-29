import Link from 'next/link';
import Image from 'next/image';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  backdrop_path: string | null;
  title: string;
}

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} passHref>
      <div className="relative w-full bg-white cursor-pointer">
        <Image
          src={movie.backdrop_path ? IMAGE_BASE_URL + movie.backdrop_path : '/path/to/default-image.jpg'}
          alt={movie.title || '제목이 없습니다'}
          width={400}
          height={280}
          className="w-full h-[300px] object-cover rounded-lg"
          layout="responsive"
        />
      </div>
      <h6 className="font-normal text-xl mb-0 mt-4">{movie.title}</h6>
    </Link>
  );
}


export default MovieCard;
