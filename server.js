const mongoose = require("mongoose");
const app = require("./app");

// ? шифруємо дані в змінні оточення - вони додані на сервер та у файл .env
const { DB_HOST, PORT = 3000 } = process.env;

// ? дод налаштування
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() =>
    // ? при успіху запуск сервер
    // ? порт перенесли в змінні оточення
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
