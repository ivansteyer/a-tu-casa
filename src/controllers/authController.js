const bcrypt = require("bcrypt");
const User = require("../models/User");
exports.getLogin = (req, res) =>
  res.render("login", { message: req.flash("message"), role: req.query.role });

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    req.flash('message', 'Usuario no encontrado');
    return res.redirect('/login');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    req.flash('message', 'Credenciales inválidas');
    return res.redirect('/login');
  }

  // 🛡️ Regenerar sesión al loguearse
  req.session.regenerate(err => {
    if (err) {
      console.error('Error regenerando sesión:', err);
      return res.status(500).send('Error de sesión');
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    req.session.save(err2 => {
      if (err2) {
        console.error('Error guardando sesión:', err2);
        return res.status(500).send('Error guardando sesión');
      }
      if (user.role === 'owner') return res.redirect('/owner/dashboard');
      return res.redirect('/tenant/dashboard'); // o '/tenant/onboarding/step1'
    });
  });
};


exports.getRegister = (req, res) =>
  res.render("register", {
    message: req.flash("message"),
    role: req.query.role,
  });

exports.postRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) {
    req.flash('message', 'El email ya está registrado');
    return res.redirect('/register');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });

  // 🛡️ Regenerar sesión al registrarse
  req.session.regenerate(err => {
    if (err) {
      console.error('Error regenerando sesión:', err);
      return res.status(500).send('Error de sesión');
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    req.session.save(err2 => {
      if (err2) {
        console.error('Error guardando sesión:', err2);
        return res.status(500).send('Error guardando sesión');
      }
      if (user.role === 'owner') return res.redirect('/owner/preferences');
      return res.redirect('/tenant/onboarding/step1'); // ajusta según tu flujo real
    });
  });
};
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};
exports.getAuthChoice = (req, res) =>
  res.render("auth-choice", { role: req.query.role });
