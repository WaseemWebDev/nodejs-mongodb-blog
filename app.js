const express = require('express');
const flash = require('express-flash');
const routes = require('./routes/routes');
require('dotenv').config();
const profileRoutes = require("./routes/profileRoute");
const  cookieParser = require('cookie-parser');
const session = require('express-session');
const connect = require("./modals/db");
const app = express();
const port = process.env.PORT || 5000;

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 7 * 24 * 60 * 60
  }
}))
// Flash middleware 
app.use(flash())
app.use((req, res, next) => {
  res.locals.message = req.flash()
  next();
})
app.use(express.static("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('keyboard cat'));
app.use(express.json());
app.set("view engine", "ejs");
connect();
app.use(routes);
app.use(profileRoutes);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})