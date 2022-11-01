const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.listen(process.env.PORT || 5000, () => {
  console.log('Server Listening in', process.env.PORT);
});
