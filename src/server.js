const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");
const sequelize = require("./models");
require("dotenv").config();
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

app.get("/", (req, res) => res.render("home"));
const authRoutes = require("./routes/auth");
const tenantRoutes = require("./routes/tenant");
const propertiesRoutes = require("./routes/properties");
const ownerRoutes = require("./routes/owner");
app.use(authRoutes);
app.use(tenantRoutes);
app.use(propertiesRoutes);
app.use(ownerRoutes);
const PORT = process.env.PORT || 3000;
(async () => {
  await sequelize.sync();
  app.listen(PORT, () => console.log("A TU CASA en http://localhost:" + PORT));
})();
