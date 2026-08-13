module.exports = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500);
  if (req.accepts('html')) {
    return res.render('error', { message: err.message });
  }
  res.json({ error: err.message });
};
