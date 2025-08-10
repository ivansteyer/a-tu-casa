const OwnerProfile = require('../models/OwnerProfile');
const OwnerPreference = require('../models/OwnerPreference');

const requireOwner = (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    res.redirect('/login');
    return false;
  }
  return true;
};

exports.dashboard = (req, res) => {
  if (!requireOwner(req, res)) return;
  res.render('owner/dashboard');
};

exports.getProfile = async (req, res) => {
  if (!requireOwner(req, res)) return;
  const profile = await OwnerProfile.findOne({ where: { ownerId: req.session.userId } });
  res.render('owner/profile', { profile });
};

exports.postProfile = async (req, res) => {
  if (!requireOwner(req, res)) return;
  const data = {
    ownerId: req.session.userId,
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    descripcion: req.body.descripcion,
  };
  if (req.file) data.fotoPerfil = `owners/${req.file.filename}`;
  const existing = await OwnerProfile.findOne({ where: { ownerId: req.session.userId } });
  if (existing) {
    await existing.update(data);
  } else {
    await OwnerProfile.create(data);
  }
  res.redirect('/owner/profile');
};

exports.getPreferences = async (req, res) => {
  if (!requireOwner(req, res)) return;
  const pref = await OwnerPreference.findOne({ where: { ownerId: req.session.userId } });
  res.render('owner/preferences', { pref });
};

exports.postPreferences = async (req, res) => {
  if (!requireOwner(req, res)) return;
  const data = {
    ownerId: req.session.userId,
    tipoContrato: req.body.tipoContrato,
    presupuestoMinimo: req.body.presupuestoMinimo ? parseInt(req.body.presupuestoMinimo) : null,
    mascotas: req.body.mascotas,
    maxPersonas: req.body.maxPersonas ? parseInt(req.body.maxPersonas) : null,
    profesionPreferida: req.body.profesionPreferida,
    nacionalidadPreferida: req.body.nacionalidadPreferida,
    otros: req.body.otros,
  };
  const existing = await OwnerPreference.findOne({ where: { ownerId: req.session.userId } });
  if (existing) {
    await existing.update(data);
  } else {
    await OwnerPreference.create(data);
  }
  res.redirect('/owner/preferences');
};
