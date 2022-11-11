const crypto = require('crypto');

const { handleError } = require('../middlewares/handleError');
const movieModel = require('../database/models').Movie;
const userModel = require('../database/models').User;
const favoriteMovieModel = require('../database/models').FavoriteMovie;

const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url));
const API = 'https://ghibliapi.herokuapp.com/films/';

const getMoviesByName = async (name) => {
  let movies = await fetch(API);
  //allMovies = await movies.json();
  return movies.find((movie) => movie.title.includes(name));
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findByPk(id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie Not Found' });
    }

    res.status(200).json({ movie });
  } catch (error) {
    handleError(res, 'There was an Error obtaining the movie', 400);
  }
};

const getAllMovies = async (req, res) => {
  try {
    let movies = await fetch(API);
    movies = await movies.json();
    movies = movies.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date,
    }));
    res.status(200).send({ movies });
  } catch (error) {
    console.log(error);
    handleError(res, 'There was an Error obtaining all the movies', 404);
  }
};

const getAllMoviesDetails = async (req, res) => {
  console.log(req.token);
  try {
    let movies = await fetch(API);
    movies = await movies.json();
    movies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      director: movie.director,
      producer: movie.producer,
      release_date: movie.release_date,
      running_time: movie.running_time,
      rt_score: movie.rt_score,
    }));
    res.status(200).send(movies);
  } catch (error) {
    console.log(error);
    handleError(
      res,
      'There was an Error obtaining all the movies details',
      404
    );
  }
};

const addNewMovie = async (req, res, next) => {
  const { title } = req.body;

  try {
    const newM = {
      code: crypto.randomUUID(),
      title: title,
      stock: 5,
      rentals: 0,
    };
    const newMovie = await movieModel.create(newM);

    res.status(201).send({ msg: newMovie });
  } catch (error) {
    console.log(error);
  }
};

const addFavouriteMovie = async (req, res, next) => {
  try {
    const code = req.params.code;
    const { review } = req.body;

    movieModel.findOne({ where: { code: code } }).then((film) => {
      if (!film)
        handleError(res, 'there was a problem adding the favorite movie', 404);

      const newFavouriteFilms = {
        MovieCode: film.code,
        UserId: req.user.id,
        review: review,
      };

      favoriteMovieModel.create(newFavouriteFilms).then((newFav) => {
        if (!newFav) handleError(res, 'FAILED to add favorite movie', 404);

        res.status(201).send({ msg: 'Movie Added to Favorites' });
      });
    });
  } catch (error) {
    handleError(res, 'there was a problem adding the favorite movie', 404);
  }
};

const getAllFavoritesMovies = async (req, res, next) => {
  try {
    const allFilms = await favoriteMovieModel.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: userModel,
        },
      ],
    });

    const filmReduced = allFilms.map((film) => {
      if (film.review != null) {
        return film;
      } else {
        return {
          id: film.id,
          MovieCode: film.MovieCode,
          UserId: film.UserId,
        };
      }
    });
    res.status(200).json(filmReduced);
  } catch (error) {
    console.log(error);
    handleError(
      res,
      'There was an Error obtaining all the favorites movies',
      404
    );
  }
};

const updateMovieStock = async (req, res) => {
  const { code } = req.params;
  const newStock = req.body;

  try {
    await movieModel.update(newStock, {
      where: { code: code },
    });

    const updatedStock = await movieModel.findOne({ where: { code: code } });

    res.status(200).json({
      msg: 'Movie Stock Updated',
      updatedStock,
    });
  } catch {
    handleError(res, 'there was an error trying to update movie stock', 400);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { code } = req.params;

    const movie = await movieModel.findOne({ where: { code: code } });

    if (!movie) {
      handleError(
        res,
        'The movie does not exist or has already been deleted',
        404
      );
    }

    await movieModel.destroy({
      where: { code },
    });
    res.status(200).json({
      msg: 'Movie Deleted',
    });
  } catch (error) {
    handleError(res, 'There was an Error deleting the User', 400);
  }
};

module.exports = {
  getAllMovies,
  getAllMoviesDetails,
  addNewMovie,
  addFavouriteMovie,
  getAllFavoritesMovies,
  getMovieById,
  deleteMovie,
  updateMovieStock,
};
