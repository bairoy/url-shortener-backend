const express = require("express");
const urlRoutes = require("./routes/urlRoutes");
const cors = require("cors");

const app = express();

app.use(cors({
  origin:"https://url-shortener-frontend-baiju.vercel.app"
}));
app.use(express.json());
app.use("/", urlRoutes);

module.exports = app;