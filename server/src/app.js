const express = require("express");
const cors = require("cors");
const path = require('path');
const morgan = require('morgan');
const planetRouter = require("./routes/planets/planets.routes");
const launchRouter = require("./routes/launches/launches.routes");
const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use("/planets",planetRouter);
app.use("/launches",launchRouter);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
module.exports = app;