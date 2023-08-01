const ctrWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      // ? даємо команду шукати обробника помилок -> express буде шукати ф-ю з 4 пар-ми
      //  ? дійде в app - там спрацює мідлевар з помилкою сервера
      next(error);
    }
  };
  return func;
};

module.exports = {
  ctrWrapper,
};
