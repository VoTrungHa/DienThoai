
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
if (process.env.NODE_ENV = "development") {
    app.use(cors());
    app.use(morgan("dev"))
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 8080;

const { InitRouterUser } = require('./src/Router/Router.User');
const { Connect } = require('./src/Config/db');
Connect();
InitRouterUser(app);

app.listen(PORT, () => console.log("server running with PORT " + PORT))

