export interface TitleText {
    text: string
};

export interface ImageInfo{
    id: string,
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
};

export interface RatingType{
    aggregateRating: number
};

export interface YearInfo {
    year: number
};

export interface PlotTextType {
    plainText: string
};

export interface PlotInfo {
    id: string,
    plotText: PlotTextType,
};

export interface Movie {
    id: string,
    titleText: TitleText,
    primaryImage: ImageInfo,
    ratingsSummary: RatingType,
    releaseYear: YearInfo,
    plot: PlotInfo,
};

export interface MoviesPayloadList {
    pageInfo?: any,
    list: Movie[]
};

export interface MoviesPayload {
    message: string,
    data: MoviesPayloadList
};

export const SITE_URL = 'http://localhost:3000'
const token = process.env.API_KEY as string;

export const fetchMovieData = async () => {
    const url = 'https://imdb188.p.rapidapi.com/api/v1/getFanFavorites?country=US';
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb188.p.rapidapi.com',
          'x-rapidapi-key': token,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from url:', error);

      const res = await fetch(SITE_URL + '/fan-movie.json');
      const data = await res.json();
      return data;
    }
  };
