const userModel = require('../database/models').User;
const userVerificationModel = require('../database/models').UserVerification;
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateJWT = require('../helpers/generate.jwt');
const { handleError } = require('../middlewares/handleError');

require('dotenv').config();

//nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail.com',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

//testing nodemailer
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Ready for messages');
//     console.log(success);
//   }
// });

const register = async (req, res) => {
  const { firstName, lastName, email, address } = req.body;

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
    const password = bcrypt.hashSync(req.body.password, salt);
    let newUser = {
      firstName,
      lastName,
      email,
      password,
      address,
      verified: false,
    };
    const user = await userModel.create(newUser);
    console.log(user.toJSON());

    sendVerificationEmail(user, res);

    const token = await generateJWT(user.id, user.firstName, user.role);

    res.status(201).json({
      msg: 'Verification email link sent, please check your email and verify your account',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'There was an error in the registration, please contact the administrator.',
    });
  }
};

//verification email
const sendVerificationEmail = async ({ id, email }, res) => {
  //url para usar en el email
  const currentUrl = 'http//localhost:3002/';

  const uniqueString = crypto.randomUUID() + id;

  //mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Verify your Email',
    html: `<p>Verify your email address to complete the signup and login into your account</p>
    <p>This link expires in 1 hour</p><p>Press <a href=${
      currentUrl + 'auth/user/verify' + '/' + id + '/' + uniqueString
    }> here </a> to proceed</p>`,
  };

  //hash the uniqueString
  const salt = bcrypt.genSaltSync();
  const hashedUniqueString = bcrypt.hashSync(uniqueString, salt);

  try {
    const newVerification = {
      user_id: id,
      unique_string: hashedUniqueString,
      expires_at: Date.now() + 3600000,
    };

    await userVerificationModel.create(newVerification);

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('Error ' + err);
      } else {
        console.log('Email sent successfully');
      }
    });
  } catch (error) {
    console.log(error);
    handleError(res, 'An error ocurred while hashing email data!', 400);
  }
};

const verifyEmail = async (req, res) => {
  const { user_id: id, uniqueString } = req.params;

  const findUser = await userVerificationModel.findOne({
    where: { user_id: id },
  });
  if (!findUser) {
    return res.send({
      msg: 'User Account doesnt exist or has been verified already',
    });
  }

  const user = findUser.toJSON();

  //check si uniqueString no vencio
  if (user.expires_at < Date.now()) {
    //uniqueString vencio, lo borramos
    await userVerificationModel.destroy({ where: { user_id: id } });

    await userModel.destroy({ where: { id: id } });

    return res.send('Verification Link Expired, register again');
  }

  const confirmUser = bcrypt.compareSync(uniqueString, user.unique_string);
  if (confirmUser) {
    return res.send({ msg: 'wrong verification code' });
  }

  //actualiza el usuario a verificado
  await userModel.update(
    {
      verified: true,
    },
    {
      where: { id: id },
    }
  );
  //borra la verificacion
  await userVerificationModel.destroy({ where: { user_id: id } });

  res.redirect('/auth/verified');
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
      return res.status(401).json({
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
  verifyEmail,
};
