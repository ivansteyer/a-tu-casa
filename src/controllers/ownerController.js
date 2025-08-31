const OwnerProfile = require('../models/OwnerProfile');
const OwnerPreference = require('../models/OwnerPreference');

exports.dashboard = (req, res) => {
  res.render('owner/dashboard');
};

exports.getPreferences = async (req, res) => {
  const pref = await OwnerPreference.findOne({ where: { ownerId: req.session.userId } });
  res.render('owner/preferences', { pref });
};

exports.postPreferences = async (req, res) => {
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
  res.redirect('/owner/dashboard');
};
