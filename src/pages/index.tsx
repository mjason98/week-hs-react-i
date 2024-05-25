import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/components/movies';

import { fetchMovieData } from '@/components/movies';

interface HomeProps {
  movies: Movie[];
}


export async function getServerSideProps() {
  const data = await fetchMovieData()
  //sort
  const movies = (data.data.list as Movie[]).sort((a, b) => a.ratingsSummary.aggregateRating - b.ratingsSummary.aggregateRating);
  
  return { props: { movies } };
}

export default function Home({ movies }: HomeProps) {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const seenMovies = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(seenMovies);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = movies.filter((movie) =>
      movie.titleText.text.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const toggleFavorite = (id:string) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className='flex flex-col w-full items-center gap-5 p-5'>
      <div className='jaro text-8xl'> Fan Movie List </div>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearch}
        className="max-w-[80%]  w-[300px] p-3 border-2 border-gray-600 rounded-xl focus:border-gray-600 focus:outline-none"
      />
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-5 mx-5">
        {filteredMovies.map((movie) => (
          <div className='flex flex-col items-center justify-between  bg-gray-200 rounded-xl py-3' key={movie.id}>
          <Link href={`/movie/${movie.id}`} className="flex flex-col gap-3 p-2 items-stretch space-y-4 w-full">
              <Image className='w-full h-[400px] object-cover rounded-xl'  
                     src={movie.primaryImage.imageUrl} 
                     alt={movie.titleText.text} 
                     width={movie.primaryImage.imageWidth}
                     height={movie.primaryImage.imageHeight}
                     priority
                     />
              <div className='text-xl text-center'>{movie.titleText.text}</div>
              <div className='grid grid-cols-2 pb-4 text-xl text-center w-full'>
                <div>⭐ {movie.ratingsSummary.aggregateRating}</div>
                <div>Year: {movie.releaseYear.year}</div>
                </div>
            
          </Link>
          {favorites.includes(movie.id)?(
            <div>✅</div>
          ):(
            <button onClick={() => toggleFavorite(movie.id)} className='bg-gray-300 w-[70%] rounded-lg p-1 hover:bg-gray-600 hover:text-white'>
              mark as seen
            </button>
          )}
          </div>
        ))}
      </div>
    </div>
  );
}
