const jwt = require('jsonwebtoken');
const userModel = require('../database/models').User;

const validateJWT = async (req, res, next) => {
  //const token = req.header('x-token');
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      msg: 'No Token in the request',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await userModel.findOne({ where: { id: uid } });
    if (!user) {
      return res.status(401).json({
        msg: 'User don´t exist',
      });
    }

    //guarda el usuario en la request
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token No Valid',
    });
  }
};

module.exports = validateJWT;
