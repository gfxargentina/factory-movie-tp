const isAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Error: You must validate the token first',
    });
  }

  const { role, firstName, lastName } = req.user;
  if (role !== 'ADMIN') {
    return res.status(401).json({
      msg: `User ${firstName} ${lastName} is not authorized to perform this action`,
    });
  }

  next();
};

const hasARole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Error: You must validate the token first',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: 'You are not authorized to perform this action, please contact the admin to activate the permissions.',
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasARole,
};
