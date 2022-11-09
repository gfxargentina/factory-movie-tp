## TP-3-Skill Factory NodeJS - Factory Movie

### STACK

- NodeJS
- Express
- PostgreSQL
- Sequelize

\*- Testing con Mocha, Chai, Supertest , ChaiHttp

### Tp-3 info

Proyecto Final de una tienda de alquiler de peliculas offline, con autenticacion/autorizacion y CRUD. Confirmacion de Cuenta de usuario por email.

### Configuracion del entorno de Desarrollo

- Crear un archivo .env y copiarle todo el contenido de .env.example , llenar con su usuario y password de base de datos, para utilizar la verificacion por
  email debe llenar los datos con un usuario de correo como por ejemplo gmail, para que envie el correo de verificacion de usuario
- npm run install para instalar dependencias
- npm run db:create , para crear la base de datos
- npm run db:migrate , para hacer las migraciones
- npm run db:seed , para ingresar usuarios y peliculas demo
- npm run db:undoall , para deshacer las migraciones
- npm run test , para correr los tests

### Usuario Admin

- Para crear el usuario ADMIN, agregar al body del enpoint /register -> role: 'ADMIN'

#### Testing

Aviso: en el archivo de testing se utilizan tests con promesas encadenadas y async/await , los assertion styles utilizados son expect y should , lo hice
de esta manera para que me quede como ayuda memoria para saber como utilizarlos en el futuro.

- Linea 236 del archivo de test: debe agregar el codigo de pelicula -> .post('/movie/favorite/codigo-pelicula-sacar-de-db')

- Linea 295 - debe agregar codigo de pelicula -> .post('/rental/codigo-pelicula-sacar-de-db')

### Prueba de Enpoints

- importar el archivo: Factory Movie TP.postman_collection.json en postman
  para realizar las pruebas de los endpoints

#### Librerias utilizadas:

"bcryptjs": "^2.4.3",
"chai": "^4.3.6",
"chai-http": "^4.3.0",
"cors": "^2.8.5",
"dotenv": "^16.0.3",
"express": "^4.18.2",
"helmet": "^6.0.0",
"jsonwebtoken": "^8.5.1",
"mocha": "^10.1.0",
"morgan": "^1.10.0",
"node-fetch": "^3.2.10",
"nodemailer": "^6.8.0",
"nodemon": "^2.0.20",
"pg": "^8.8.0",
"pg-hstore": "^2.3.4",
"sequelize": "^6.25.3",
"supertest": "^6.3.1"
