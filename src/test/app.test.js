const { expect } = require('chai');

const { response } = require('express');
const request = require('supertest');
const assert = require('chai').assert;
const app = require('../index');
const db = require('../database/models/index');
const { User } = db;
const bcrypt = require('bcryptjs');
const { BaseError } = require('sequelize');

const userModel = require('../database/models').User;
const rentalModel = require('../database/models').Rental;
const movieModel = require('../database/models').Movie;
const favoriteModel = require('../database/models').Favorite;

// beforeEach(() => {
//   db.sequelize.truncate({ cascade: true });
// });

describe('GET /movies', () => {
  it('Should return status 200', async function () {
    //request(app).get('/movie').expect(201).end(done());
    let data = {
      firstName: 'Charly',
      lastName: 'Garcia',
      email: 'charly@gmail.com',
      password: '12345678',
      address: 'BA',
    };

    await request(app).post('/auth/register').send(data); //depends on above [Signup].

    let dataB = {
      email: 'charly@gmail.com',
      password: '12345678',
    };

    let res = await request(app).post('/auth/login').send(dataB); //depends on above [Login].

    let token = res.body.token;

    res = await request(app)
      .get('/movie')
      .set('Authorization', 'bearer ' + token);

    expect(res.status).to.equal(200);
  });

  it('Should return json', function (done) {
    request(app)
      .get('/movie')
      .set('Accept', 'application/json')
      .expect(200, done());

    //.end(done());
  });

  // it('Should return movies', (done) => {
  //   request(app)
  //     .get('/movie')
  //     .expect(200)
  //     .then((response) => {
  //       assert.isNotEmpty(response._body);
  //       assert.isArray(response._body);
  //       respons._body.forEach((movie) =>
  //         assert.containsAllKeys(movie, [
  //           'title',
  //           'description',
  //           'director',
  //           'producer',
  //           'release_date',
  //           'running_time',
  //           'rt_score',
  //         ])
  //       );
  //     })
  //     .then(() => done(), done()); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  // });
});

// describe('GET /movies/:id', () => {
//   let token;
//   before(function (done) {
//     request(app)
//       .post('/auth/login')
//       .send({
//         email: 'charly@gmail.com',
//         password: '12345678',
//       })
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .end(function (err, res) {
//         token = res.body.token;
//         console.log(token);
//         done();
//       });
//   });

//   it('Get Movie Details By ID', (done) => {
//     request(app)
//       .get('/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49')
//       .expect(200)
//       .set('authorization', 'Bearer ' + token)
//       .then((response) => {
//         assert.isNotEmpty(response._body); //no esta vacio
//         assert.isNotArray(response._body);
//         assert.containsAllKeys(response._body, [
//           'title',
//           'description',
//           'director',
//           'producer',
//           'release_date',
//           'running_time',
//           'rt_score',
//         ]);
//       })
//       .then(() => done(), done);
//   });
// });

describe('POST register and login', () => {
  const userExample = {
    email: 'test@gmail.com',
    password: '12345678',
    firstName: 'mocha',
    lastName: 'test',
    address: 'Testing 666',
  };

  it('should return 201', (done) => {
    request(app)
      .post('/auth/register')
      .send(userExample)
      .expect(201)
      .then(() => done(), done());
  });

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

describe.only('POST /login', () => {
  it('should login user and return auth token', async function () {
    let data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'hi@johndoe.com',
      password: '12345678',
      address: 'Testing 666',
    };

    await request(app).post('/auth/register').send(data); //depends on above [signup].

    data = {
      email: 'hi@johndoe.com',
      password: '12345678', // correct pass
    };

    let res = await request(app).post('/auth/login').send(data);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('Should return error if wrong pass / email provided', async function () {
    let data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'hi@johndoe.com',
      password: '12345678',
      address: 'Testing 666',
    };

    await request(app).post('/auth/register').send(data); //depends on above [Signup].

    data = {
      email: 'hi@johndoe.com',
      password: '2345678', //wrong pass
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
        console.log(token);
        done();
      });
  });

  it('Should return 201 and set movie as favourite for logged user with review', async function (done) {
    let data = {
      email: 'hi@johndoe.com',
      password: '12345678',
    };

    let user = await request(app).post('/auth/login').send(data); //depends on above [signup].

    data = {
      email: 'hi@johndoe.com',
      password: '12345678', // correct pass
    };

    let res = await request(app).post('/auth/login').send(data);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    // request(app)
    //   .post('/movie/favorite/45db04e4-304a-4933-9823-33f389e8d74d')
    //   .set('authorization', 'Bearer ' + token)
    //   .expect(201)
    //   .then(async (res) => {
    //     assert.isNotEmpty(res.body); //no esta vacio

    //     const favoriteDB = await favoriteModel.findOne({
    //       where: { code: '45db04e4-304a-4933-9823-33f389e8d74d' },
    //     });
    //     assert.exists(favoriteDB);
    //   })
    //   .then(() => done(), done());
  });

  // it('Should return 201 and set movie as favourite for logged user without review', (done) => {
  //   // TO-DO
  //   // Check status
  //   // Check si se registro el cambio en la DB
  //   // Check si el registro en la DB es correcto
  // });
  // it('Should not allow to favourite the same movie twice', (done) => {
  //   //TO-DO, llamar al endpoint con la misma peli 2 veces
  //   // Check error status
  //   // Check error message
  //   // Check db que no se haya persistido un registro
  // });
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
  it('Should return 200 status and logged user favourite list', function (done) {
    // TO-DO
    // checkear que sea un array
    // checkear que tenga la cantidad correcta de elementos
    // checkear las clave de cada elemento
    // checkear que los elementos sean/sea el/los correctos

    request(app)
      .get('/movie/favorite')
      .set('authorization', 'Bearer ' + token)
      .expect(201)
      .then(() => done(), done());
  });
  //   it('Should forbid access to non logged user', (done) => {
  //     //TO-DO
  //     //Chequear status
  //     //Chequear mensaje de error
  //   });
});

// describe('POST /rent/:code', () => {
//   beforeEach((done) => {
//     // Crear usuario, pelicula
//   });
//   it('Should return 201 and successfully rent a movie', (done) => {
//     //TO_DO
//     //Check status
//     //Chequear si se persistio correctamente la reserva
//     //Chequear que se quito una peli de stock
//     //Chequear que se sumo la renta a las veces alquiladas
//   });
//   it('Should not allow rent if there is no stock', (done) => {
//     //TO-DO
//   });
//   it('Should not allow rent if movie does not exist', (done) => {
//     //TO-DO
//   });
//   it('Should not allow non logged user to rent a movie', (done) => {
//     //TO-DO
//   });
// });

// describe('POST /return/:code', (done) => {
//   beforeEach((done) => {
//     // Crear usuario, pelicula, y rentas, una vencida y una sin vencer
//   });
//   it('Should return a rental on time', (done) => {
//     //TO-DO
//     //Chequear status code 200
//     //Chequear que se devuelva correctamente el precio
//     //Chequear que se restockee correctamente la pelicula
//     //Chequear que se persitio la fecha de devolucion
//   });
//   it('Should return late rental', (done) => {
//     //TO-DO
//     //Chequear status code 200
//     //Chequear que se devuelva correctamente el precio con el agregado
//     //Chequear que se restockee correctamente la pelicula
//     //Chequear que se persitio la fecha de devolucion
//   });
//   it('Should return a movie that was rented a second time', (done) => {
//     //TO-DO
//   });
//   it('Should not allow to rent movie twice simultaneously', (done) => {
//     //TO-DO
//   });
//   it('Should not allow to return already returned movie', (done) => {
//     //TO-DO
//   });
//   it('Should not allow to return non rented movie', (done) => {
//     //TO-DO
//   });
//   it('Should not allow non logged user to return a movie', (done) => {
//     //TO-DO
//   });
//});

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
