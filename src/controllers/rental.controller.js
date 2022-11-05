const rentalModel = require('../database/models').Rental;
const movieModel = require('../database/models').Movie;
const movieRentalModel = require('../database/models').Movie_Rental;
const { Op } = require('sequelize');

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

    console.log(updateMovie);

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
    res.send('algo salio mal');
  }
};

//   movieModel
//     .findOne({
//       where: { code: code, stock: { [Op.gt]: 0 } },
//     })
//     .then((rental) => {
//       if (!rental) throw new Error(' Missing stock ');
//       rentalModel
//         .create({
//           code: rental.code,
//           user_id: req.user.id,
//           rental_date: Date.now(),
//           refund_date: new Date(Date.now() + 3600 * 1000 * 24 * 7),
//           total_cost: 10,
//         })
//         .then((data) => {
//           movieModel
//             .update(
//               { stock: rental.stock - 1, rentals: rental.rentals + 1 },
//               { where: { code: rental.code } }
//             )
//             .then(() => res.status(201).send(data));
//         });
//     });
// };

module.exports = movieRent;
