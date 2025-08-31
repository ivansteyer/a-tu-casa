const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const sequelize = require("./models"); // debe exportar la instancia
const authRoutes = require("./routes/auth");
const tenantRoutes = require("./routes/tenant");
const propertiesRoutes = require("./routes/properties");
const ownerRoutes = require("./routes/owner");
const apiRoutes = require("./routes/api");

const app = express();

// Si algún día usas proxy (nginx), habilita esta línea:
app.set("trust proxy", 1);

// Vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // <- útil para endpoints JSON
app.use(methodOverride("_method"));

// Static
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Sesión (para prod usa un store externo)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // activar en HTTPS
      // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días, si quieres
    },
  })
);

app.use(flash());

// Variables comunes a las views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

// Rutas
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);                 // monta según lo que defina el router
app.use("/tenant", tenantRoutes);    // baseUrl = /tenant (tu controller lo usa)
app.use(propertiesRoutes);
app.use(ownerRoutes);
app.use("/api", apiRoutes);

// 404
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(404).render("404");
});

// Handler de errores (centraliza next(err))
app.use((err, req, res, next) => {
  console.error(err);
  if (req.originalUrl.startsWith("/api")) {
    return res.status(500).json({ error: "Internal server error" });
  }
  res.status(500).render("error", { error: err });
});

// Arranque
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    // En desarrollo puedes usar alter:true para ajustar columnas
    await sequelize.sync(); // o { alter: true } mientras estabilizas modelos
    app.listen(PORT, () =>
      console.log(`A TU CASA en http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error("No se pudo iniciar el servidor:", e);
    process.exit(1);
  }
})();