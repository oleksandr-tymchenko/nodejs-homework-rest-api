const express = require("express");
const logger = require("morgan");
const cors = require("cors");

// ? для отр даних з env, викл ->
const dotenv = require("dotenv");
// ? далі в нього викликаємо метод config()

const contactsRouter = require("./routes/api/contacts");

dotenv.config(); // ? він шукає файл .env і додає дані з нього

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
