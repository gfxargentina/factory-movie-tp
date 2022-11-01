const userModel = require('../database/models').User;
const bcrypt = require('bcryptjs');
const generateJWT = require('../helpers/generate.jwt');

const register = async (req, res) => {
  try {
    let findUser = await userModel.findOne({
      where: { email: req.body.email },
    });

    if (findUser) {
      return res.status(400).json({
        sucess: false,
        msg: 'A user already exists with that email',
      });
    }

    const salt = bcrypt.genSaltSync();
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const user = await userModel.create(req.body);

    const token = await generateJWT(user.id, user.firstName, user.role);

    res.status(201).json({
      msg: 'successful registration',
      uid: user.id,
      name: user.firstName,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Username or password does not exist, please contact the administrator.',
    });
  }
};

const login = async (req, res) => {
  res.send('LOGIN');
};

module.exports = {
  register,
  login,
};
