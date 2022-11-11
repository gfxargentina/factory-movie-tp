const { handleError } = require('../middlewares/handleError');

const userModel = require('../database/models').User;
const rentalModel = require('../database/models').Rental;
const movieModel = require('../database/models').Movie;

const getAllUserRentals = async (req, res) => {
  console.log(req.authorization);
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const newUser = req.body;

    await userModel.update(newUser, {
      where: { id: id },
    });

    const updatedUser = await userModel.findByPk(id);

    res.status(200).json({
      msg: 'User Updated',
      updatedUser,
    });
  } catch (error) {
    handleError(res, 'There was an Error obtaining all the Users Movies', 400);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ where: { id: id } });

    if (!user) {
      handleError(res, 'User does not exist or has already been deleted', 404);
    }

    await userModel.destroy({
      where: { id },
    });

    res.status(200).json({
      msg: 'User Deleted',
    });
  } catch (error) {
    handleError(res, 'There was an Error deleting the User', 400);
  }
};

module.exports = {
  getAllUserRentals,
  allUserMovies,
  updateUser,
  deleteUser,
};
