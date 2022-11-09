//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

const { expect } = require('chai');
require('chai').should();

let chai = require('chai'),
  chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { response } = require('express');
const request = require('supertest');
const assert = require('chai').assert;
const app = require('../index');
const db = require('../database/models/index');
const { User } = db;
const bcrypt = require('bcryptjs');
const { BaseError } = require('sequelize');

// beforeEach(() => {
//   db.sequelize.truncate({ cascade: true });
// });

describe('Post /Movie ', () => {
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;

        done();
      });
  });
  it('Should Add a New Movie', async () => {
    const newMovie = {
      title: 'Pelicula Test',
    };
    const res = await chai
      .request(app)
      .post('/movie/')
      .set('authorization', 'Bearer ' + token)
      .send(newMovie);

    res.should.have.status(201);
    res.body.should.be.a('object');
    res.body.should.have.property('msg');
  });

  it('Should show one movie details by id ', async () => {
    const res = await chai
      .request(app)
      .get('/movie/12')
      .set('authorization', 'Bearer ' + token);
    console.log(res.body);

    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('movie');
    res.body.movie.should.have.property('id');
    res.body.movie.should.have.property('code');
    res.body.movie.should.have.property('title');
    res.body.movie.should.have.property('stock');
    res.body.movie.should.have.property('rentals');
    res.body.movie.should.have.property('UserId');
    res.body.movie.should.have.property('FavoriteMovieId');
  });
});

describe('GET All /movies', () => {
  it('Should return status 200 and be a json', async () => {
    const res = await chai.request(app).get('/movie');

    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.should.have.property('movies');
    res.body.movies.should.be.a('array');
    res.body.movies[0].should.have.property('title');
    res.body.movies[0].should.have.property('release_date');
  });
});

describe('GET /movies Details', () => {
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;
        done();
      });
  });

  it('Get Movies Details ', async () => {
    const res = await chai
      .request(app)
      .get('/movie/details')
      .set('authorization', 'Bearer ' + token);

    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body[0].should.have.property('id');
    res.body[0].should.have.property('title');
    res.body[0].should.have.property('description');
    res.body[0].should.have.property('director');
    res.body[0].should.have.property('producer');
    res.body[0].should.have.property('release_date');
    res.body[0].should.have.property('running_time');
    res.body[0].should.have.property('rt_score');
  });
});

describe('POST register and login', () => {
  const userExample = {
    firstName: 'Ethereal 04',
    lastName: 'Email',
    email: 'example4@email.com',
    password: '12345678',
    address: 'Testing 666',
    verified: true,
  };

  it('should user register', (done) => {
    request(app)
      .post('/auth/register')
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok);
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body.usuario, [
          'email',
          'password',
          'firstName',
          'lastName',
          'address',
          'createdAt',
          'updatedAt',
        ]);
        const userDB = await User.findOne({
          where: { email: userExample.email },
        });
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done());
  });

  it('Should not allowed user to register twice', async function () {
    let data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'hi@johndoe.com',
      password: '12345678',
      address: 'Testing 666',
    };

    let res = await request(app).post('/auth/register').send(data);

    expect(res.status).to.equal(400);
  });
});

describe('POST /login', () => {
  it('should login user and return auth token', async function () {
    data = {
      email: 'hi@johndoe.com',
      password: '12345678', // correct pass
    };

    let res = await request(app).post('/auth/login').send(data);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('Should return error if wrong pass / email provided', async function () {
    data = {
      email: 'hi@johndoe.com',
      password: '2345678',
    };

    let res = await request(app).post('/auth/login').send(data);

    expect(res.status).to.equal(401);
  });
});

describe('POST /favourite/:code', () => {
  //guarda el token para usarlo despues en los it
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;

        done();
      });
  });

  it('Should return 201 and set movie as favourite for logged user with review', async () => {
    const res = await chai
      .request(app)
      .post('/movie/favorite/5fdfb320-2a02-49a7-94ff-5ca418cae602')
      .set('authorization', 'Bearer ' + token);

    res.should.have.status(201);
    res.body.should.be.a('object');
    res.body.should.have.property('msg');
  });
});

describe('GET /favourites', () => {
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;
        done();
      });
  });
  it('Should return 200 status and logged user favourite list', async () => {
    const res = await chai
      .request(app)
      .get('/movie/favorite')
      .set('authorization', 'Bearer ' + token);

    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body[0].should.have.property('id');
    res.body[0].should.have.property('MovieCode');
    res.body[0].should.have.property('UserId');
  });
});

describe('Post /Rental ', () => {
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;

        done();
      });
  });
  it('Should Rent a Movie', async () => {
    const res = await chai
      .request(app)
      .post('/rental/ff24da26-a969-4f0e-ba1e-a122ead6c6e3')
      .set('authorization', 'Bearer ' + token);

    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('newRental');
  });

  it('Should List all Movies Rental from user', async () => {
    const res = await chai
      .request(app)
      .get('/user/rentals')
      .set('authorization', 'Bearer ' + token);

    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('movies');
  });
});

describe('Negative Tests', () => {
  let token;
  before(function (done) {
    request(app)
      .post('/auth/login')
      .send({
        email: 'charly@gmail.com',
        password: '12345678',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        token = res.body.token;

        done();
      });
  });

  it('Should not return all favorite movies, 401 Authentication Failed', async () => {
    const res = await chai
      .request(app)
      .get('/movie/favorite')
      .set('authorization', 'Bearer ');

    res.should.have.status(401);
  });
});

describe('Not Found handling', () => {
  it('Should return status 404', (done) => {
    request(app)
      .get('/gghghg')
      .expect(404)
      .then((response) => {
        assert.equal(response.res.statusMessage, 'Not Found');
      })
      .then(() => done(), done);
  });
});
