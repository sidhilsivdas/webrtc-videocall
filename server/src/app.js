const express = require("express");
const cors = require("cors");
const path = require('path');
const morgan = require('morgan');
const userRouter = require("./routes/users/users.routes");
const authRouter = require("./routes/auth/auth.routes");
const categoryRouter = require("./routes/categories/categories.routes");
const productRouter = require("./routes/products/products.routes");
const colorRouter = require("./routes/colors/colors.routes");
const stockRouter = require("./routes/stocks/stocks.routes");
const customerRouter = require("./routes/customers/customers.routes");
const requestRouter = require("./routes/requests/requests.routes");

const {adminAuth} = require("./middlewares/adminAuth");
const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
//app.use("/planets",planetRouter);
//app.use("/launches",launchRouter);
app.use("/auth", authRouter);
app.use("/users", adminAuth, userRouter);
app.use("/categories", adminAuth, categoryRouter);
app.use("/products", adminAuth, productRouter);
app.use("/colors", adminAuth, colorRouter);
app.use("/stocks", adminAuth, stockRouter);
app.use("/customers", adminAuth, customerRouter);
app.use("/requests", adminAuth, requestRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
module.exports = app;