const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("mysql");
const md5 = require("md5");
const path = require("path");
const handlebars = require("handlebars");

const routes = require("./routes/index");
const users = require("./routes/users");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

handlebars.registerHelper("ifCond", function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", express.static("./public"));

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      const namespace = param.split("."),
      root = namespace.shift(),
      formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/", routes);
app.use("/users", users);

app.set("port", process.env.PORT || 3000);

app.listen(5555, function() {
  console.log("Server started on port 3000");
});
