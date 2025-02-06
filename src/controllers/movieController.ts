import axios from 'axios';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Movie from '../models/movieModel';

const getMovieFromTMDB = async (title: string) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: apiKey,
          query: title,
          language: 'pt-BR',
        },
      }
    );

    if (response.data.results.length === 0) {
      throw new Error('Filme não encontrado no TMDB.');
    }

    return response.data.results[0];
  } catch (error) {
    throw new Error('Erro ao buscar informações do TMDB.');
  }
};

const getGenresFromTMDB = async () => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list`,
      {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
        },
      }
    );
    const genres = response.data.genres;

    const genreMap: { [key: number]: string } = {};

    genres.forEach((genre: { id: number; name: string }) => {
      genreMap[genre.id] = genre.name;
    });

    return genreMap;
  } catch (error) {
    throw new Error('Erro ao buscar gêneros do TMDB.');
  }
};

export const addMovie = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Título do filme é necessário.' });
      return;
    }

    const existingMovie = await Movie.findOne({ title });

    if (existingMovie) {
      res.status(400).json({ message: 'Filme já adicionado à lista!' });
      return;
    }

    const movieData = await getMovieFromTMDB(title);

    const genreMap = await getGenresFromTMDB();

    const genres = movieData.genre_ids.map(
      (id: number) => genreMap[id] || 'Gênero desconhecido'
    );

    const userId = uuidv4();

    const newMovie = new Movie({
      tmdbId: movieData.id.toString(),
      title: movieData.title,
      synopsis: movieData.overview,
      releaseYear: movieData.release_date?.split('-')[0],
      genre: genres,
      userId,
    });

    await newMovie.save();

    newMovie.history.push({ action: 'Filme adicionado à lista de desejos' });

    await newMovie.save();

    res
      .status(201)
      .json({ message: 'Filme adicionado com sucesso!', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar filme.', error });
  }
};

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const state = req.query.state as string;
    const rating = req.query.rating
      ? parseFloat(req.query.rating as string)
      : 0;

    const skip = (page - 1) * limit;

    const query: any = {};
    if (state) query.state = state;
    if (rating) query.rating = { $gte: rating };

    const movies = await Movie.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    const totalMovies = await Movie.countDocuments();

    res.status(200).json({
      totalMovies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar filmes.', error });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado.' });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter filme.', error });
  }
};

export const updateMovieState = async (req: Request, res: Response) => {
  try {
    const { state } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado.' });
      return;
    }

    if (state === 'Avaliado' && movie.state !== 'Assistido') {
      res.status(400).json({
        message: 'O filme precisa ser assistido antes de ser avaliado.',
      });
      return;
    }

    if (
      (state === 'Recomendado' || state === 'Não recomendado') &&
      movie.state !== 'Avaliado'
    ) {
      res.status(400).json({
        message:
          'O filme precisa ser avaliado antes de ser recomendado ou não recomendado.',
      });
      return;
    }

    movie.state = state;

    movie.history.push({ action: `Filme movido para estado: ${state}` });

    await movie.save();
    res
      .status(200)
      .json({ message: 'Estado do filme atualizado com sucesso!', movie });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao atualizar estado do filme.', error });
  }
};

export const rateMovie = async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado.' });
      return;
    }

    if (movie.state === 'A assistir') {
      res.status(400).json({
        message: 'O filme precisa ser assistido antes de ser avaliado.',
      });
      return;
    }

    movie.rating = rating;

    movie.history.push({ action: `Filme avaliado com nota: ${rating}` });

    await movie.save();
    res.status(200).json({ message: 'Filme avaliado com sucesso!', movie });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao avaliar filme.', error });
  }
};

export const getMovieHistory = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado.' });
      return;
    }
    
    res.status(200).json(movie.history);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao obter histórico do filme.', error });
  }
};
