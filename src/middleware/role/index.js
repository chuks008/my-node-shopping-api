const roleAuth = (roles = []) => {
  if (typeof roles === 'string') {
    // eslint-disable-next-line no-param-reassign
    roles = [roles];
  }

  return [
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({
          message: 'Access denied. Only admins can access this route',
        });
      }

      return next();
    },
  ];
};

module.exports = roleAuth;
