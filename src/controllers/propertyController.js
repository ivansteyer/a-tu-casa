const Property = require('../models/Property');
const Match = require('../models/Match');

exports.list = async (req, res) => {
  const props = await Property.findAll();
  res.render('properties/list', { props });
};

exports.detail = async (req, res) => {
  const p = await Property.findByPk(req.params.id);
  if (!p) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/properties');
  }
  res.render('properties/detail', { p, message: req.flash('message') });
};

exports.matchesForTenant = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'tenant') {
    return res.redirect('/login');
  }
  const matches = await Match.findAll({ where: { userId: req.session.userId, status: 'matched' } });
  res.render('tenant/matches', { matches });
};

exports.like = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'tenant') {
    req.flash('message', 'Debes ingresar como inquilino');
    return res.redirect('/login');
  }

  const propertyId = req.params.id;
  const prop = await Property.findByPk(propertyId);
  if (!prop) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/properties');
  }

  let m = await Match.findOne({ where: { userId: req.session.userId, propertyId } });

  if (!m) {
    // Primer "like" del inquilino
    m = await Match.create({ userId: req.session.userId, propertyId, status: 'liked' });
    req.flash('message', '¡Enviado! Si el propietario también te elige, habrá Match.');
  } else if (m.status === 'liked') {
    // Si ya existía un "like" (p.ej. del propietario), ahora pasa a match
    m.status = 'matched';
    await m.save();
    req.flash('message', '¡Se produjo un Match con el propietario!');
  } else if (m.status === 'rejected') {
    m.status = 'liked';
    await m.save();
    req.flash('message', 'Se actualizó tu interés.');
  } else {
    req.flash('message', '¡Ya hay Match en esta propiedad!');
  }

  return res.redirect('/properties/' + propertyId);
};
