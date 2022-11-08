const rentalModel = require('../database/models').Rental;
const movieModel = require('../database/models').Movie;
const movieRentalModel = require('../database/models').Movie_Rental;
const { Op } = require('sequelize');
const { handleError } = require('../middlewares/handleError');

const movieRent = async (req, res) => {
  const { code } = req.params;

  try {
    const movieToRent = await movieModel.findOne({
      where: { code: code, stock: { [Op.gt]: 0 } },
    });
    if (!movieToRent) throw new Error(' Missing stock ');
    //console.log(movieToRent.toJSON());

    const newRental = await rentalModel.create({
      code: movieToRent.code,
      user_id: req.user.id,
      rental_date: Date.now(),
      refund_date: new Date(Date.now() + 3600 * 1000 * 24 * 7),
      total_cost: 10,
    });
    //console.log(newRental.toJSON());

    const update = {
      stock: movieToRent.stock - 1,
      rentals: movieToRent.rentals + 1,
    };

    const updateMovie = await movieModel.update(update, {
      where: { code: code },
    });

    //junction table -Many to Many
    await movieRentalModel.create({
      rentalID: newRental.rental_id,
      movieID: movieToRent.id,
    });

    res.send({
      newRental,
      updateMovie,
    });
  } catch (error) {
    console.log(error);
    handleError(res, 'there was an error trying to rent the movie', 404);
  }
};

const returnMovie = async (req, res, next) => {
  const { code } = req.params;

  try {
    //actualiza la pelicula alquilada con la fecha en la que el usuario devuelve la pelicula
    const updatedRental = await rentalModel.update(
      { userRefund_date: Date.now() },
      { where: { code: code, user_id: req.user.id } }
    );

    //busca la pelicula alquilada actualizada
    const updatedMovieRent = await rentalModel.findOne({
      where: { code: code },
    });

    //busca la pelicula
    let movie = await movieModel.findOne({ where: { code: code } });

    //actualiza el stock de la pelicula
    const updatedMovie = await movieModel.update(
      { stock: movie.stock + 1 },
      { where: { code: code } }
    );

    //realiza el cobro dependiendo la fecha en que el usuario devolvio la pelicula
    if (
      daysDifference(
        updatedMovieRent.rental_date,
        updatedMovieRent.userRefund_date
      ) <=
      daysDifference(updatedMovieRent.rental_date, updatedMovieRent.refund_date)
    ) {
      const daysDiff = daysDifference(
        updatedMovieRent.rental_date,
        updatedMovieRent.refund_date
      );
      if (daysDiff === 0) {
        res.status(200).send({
          msg: 'On-time delivery, Final price $1',
        });
      } else {
        res.status(200).send({
          msg: `On-time delivery, Final price $${daysDiff}`,
        });
      }
    } else {
      const penalty = lateRefund(
        daysDifference(
          updatedMovieRent.rental_date,
          updatedMovieRent.refund_date
        ) * 10,
        daysDifference(
          updatedMovieRent.userRefund_date,
          updatedMovieRent.refund_date
        )
      );
      res
        .status(200)
        .send({ msg: `Late delivery, the penalty is $${penalty}` });
    }
  } catch (error) {
    console.log(error);
    handleError(res, 'there was an error trying to return the movie', 404);
  }
};

const daysDifference = (start, end) => {
  const dateOne = new Date(start);

  const dateSecond = new Date(end);

  const oneDay = 1000 * 3600 * 24;

  const differenceTime = dateSecond.getTime() - dateOne.getTime();

  const differenceDays = Math.round(differenceTime / oneDay);

  return differenceDays;
};

const lateRefund = (originalPrice, daysLate) => {
  let finalPrice = originalPrice;

  for (let i = 0; i < daysLate; i++) {
    finalPrice += finalPrice * 0.1;
  }

  return finalPrice;
};

module.exports = {
  movieRent,
  returnMovie,
};
