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
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        msg: `There is no user with this email address ${email}`,
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Incorrect user or password',
      });
    }

    const token = await generateJWT(user.id);
    res.json({
      msg: 'successful login',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'login failed, Talk to the administrator',
    });
  }
};

module.exports = {
  register,
  login,
};
