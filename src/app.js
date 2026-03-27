const express = require("express");
const urlRoutes = require("./routes/urlRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", urlRoutes);

module.exports = app;