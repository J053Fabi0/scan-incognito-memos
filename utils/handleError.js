module.exports = (res, err, code = 400) => {
  console.log(err);
  res.status(code).send({ message: err?.message || err });
};
