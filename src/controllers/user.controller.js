const { handleError } = require('../middlewares/handleError');

const userModel = require('../database/models').User;
const rentalModel = require('../database/models').Rental;
const movieModel = require('../database/models').Movie;

const getAllUserRentals = async (req, res) => {
  try {
    const allUsers = await userModel.findAll({
      include: [
        {
          model: rentalModel,
          attributes: {
            exclude: ['UserId', 'createdAt', 'updatedAt'],
          },
        },
      ],
      attributes: {
        exclude: ['password', 'address', 'role', 'createdAt', 'updatedAt'],
      },
    });
    res.status(200).json(allUsers);
  } catch (error) {
    handleError(res, 'There was an Error obtaining all the Users Rentals', 404);
  }
};

//busca todos los aquileres
const allUserMovies = async (req, res) => {
  try {
    const movies = await rentalModel.findAll({
      include: [
        {
          model: movieModel,

          attributes: ['title'],
          through: {
            attributes: ['rentalID', 'movieID'],
          },
        },
        //TODO: otro include con userModel, hacer un map para acomadar que muestre todos los usuarios
        //con sus peliculas
      ],
    });

    res.send({
      movies,
    });
  } catch (error) {
    handleError(res, 'There was an Error obtaining all the Users Movies', 404);
  }
};

module.exports = {
  getAllUserRentals,
  allUserMovies,
};
