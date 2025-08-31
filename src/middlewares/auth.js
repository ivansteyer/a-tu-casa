/**
 * Verifica que el usuario tenga sesión iniciada.
 * Si no, redirige a /login
 */
exports.ensureAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.redirect("/login");
  }
  next();
};

/**
 * Verifica que el usuario tenga un rol específico (owner, tenant, etc.)
 * Uso: ensureRole('owner') o ensureRole('tenant')
 */
exports.ensureRole = (role) => (req, res, next) => {
  if (req.session?.role !== role) {
    return res.status(403).send("No autorizado");
  }
  next();
};

exports.onlyTenant = (req, res, next) => {
  if (!req.session.userId || req.session.role !== "tenant") {
    return res.redirect("/login"); // o res.status(403).send("No autorizado");
  }
  next();
};