module.exports = (res, err, code = 400) => {
  console.log(err);
  res.status(code).send({ code: 2, message: err?.message || err });
};
