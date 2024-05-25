import axios from 'axios';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

import { Movie, fetchMovieData } from '@/components/movies';

interface MovieDetailsProps {
  movie: Movie;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;
  const data = await fetchMovieData()
  
  const movie = (data.data.list as Movie[]).find((movie) => movie.id === id);
  
  return { props: { movie } };
}

export default function MovieDetails({ movie }:MovieDetailsProps) {
  return (
    <div className='w-full flex flex-col items-center text-center pt-6 gap-5'>
      <Image className='w-full max-w-[400px] max-h-[500px] object-cover rounded-xl'  
                     src={movie.primaryImage.imageUrl} 
                     alt={movie.titleText.text} 
                     width={movie.primaryImage.imageWidth}
                     height={movie.primaryImage.imageHeight}
                     priority
                     />
      <div className='text-5xl' >{movie.titleText.text} ({movie.releaseYear.year}) </div>
      <div className='text-2xl' >⭐ {movie.ratingsSummary.aggregateRating} </div>
      <div className='text-xl'> {movie.plot.plotText.plainText} </div>
      <Link className='text-xl jaro'  href="/">Back to list</Link>
    </div>
  );
}
