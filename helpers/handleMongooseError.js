const handleMongooseError = (error, data, next) => {
  // * модифиікуємо для перев на уніукальність і дод статус 409
  const { name, code } = error;
  console.log(name);
  console.log(code);
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

module.exports = { handleMongooseError };
