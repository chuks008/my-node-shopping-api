module.exports = (req, res, next) => {
  const a = req.query.first;
  const b = req.query.second;

  req.query.first = Number(a);
  req.query.second = Number(b);

  next();
};
