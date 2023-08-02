const handleMongooseError = (error, data, next) => {
  // * додаємо статус помилки
  error.status = 400;
  console.log(error);
};

module.exports = { handleMongooseError };
