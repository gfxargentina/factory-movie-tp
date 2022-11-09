const handleError = (res, message = 'Something went Wrong', code = 500) => {
  res.status(code);
  res.send({ error: message });
};

const notFound = (req, res, next) => {
  res.status(404).send('Route not Found');
};

module.exports = {
  handleError,
  notFound,
};
