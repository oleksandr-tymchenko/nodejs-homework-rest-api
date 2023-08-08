const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { HttpError } = require("../helpers");

const { User } = require("../models/user");
dotenv.config();
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  // ? отр заголов авторизейшн (
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  // ? перев токен за допом бібл jwt та секр ключів
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    //   ? додаємо дод перевірки які потр при разлогіненні
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }
    //   ? для того щоб контролювати яка людини зараз працює додаємо
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = authenticate;
