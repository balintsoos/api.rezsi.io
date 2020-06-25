const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");

const cors = require("./middlewares/cors");
const auth = require("../../modules/auth/auth");
const router = require("./routers/main.router");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.use(auth.initialize());
app.use("/api/v1", router);

module.exports = app;
