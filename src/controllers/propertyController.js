const Property = require('../models/Property');
const PropertyPhoto = require('../models/PropertyPhoto');
const Match = require('../models/Match');
const TenantProfile = require('../models/TenantProfile');
const User = require('../models/User');

const list = async (req, res) => {
  const props = await Property.findAll({ include: [{ model: PropertyPhoto, as: 'fotos' }] });
  res.render('properties/list', { props });
};

const detail = async (req, res) => {
  const p = await Property.findByPk(req.params.id, { include: [{ model: PropertyPhoto, as: 'fotos' }] });
  if (!p) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/properties');
  }
  res.render('properties/detail', { p, message: req.flash('message') });
};

const matchesForTenant = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'tenant') {
    return res.redirect('/login');
  }
  const matches = await Match.findAll({ where: { userId: req.session.userId, status: 'matched' } });
  res.render('tenant/matches', { matches });
};

const like = async (req, res) => {
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
    m = await Match.create({ userId: req.session.userId, propertyId, status: 'liked' });
    req.flash('message', '¡Enviado! Si el propietario también te elige, habrá Match.');
  } else if (m.status === 'liked') {
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

const ownerList = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const props = await Property.findAll({ where: { ownerId: req.session.userId }, include: [{ model: PropertyPhoto, as: 'fotos' }] });
  res.render('owner/properties', { props });
};

const getNew = (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  res.render('owner/new');
};

const postNew = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const d = {
    ownerId: req.session.userId,
    titulo: req.body.titulo,
    tipo: req.body.tipo,
    habitaciones: req.body.habitaciones ? parseInt(req.body.habitaciones) : null,
    ubicacion: req.body.ubicacion,
    terraza: !!req.body.terraza,
    precio: req.body.precio ? parseInt(req.body.precio) : null,
    modalidad: req.body.modalidad,
    disponibleDesde: req.body.disponibleDesde || null,
    descripcion: req.body.descripcion,
  };
  const prop = await Property.create(d);
  if (req.files) {
    for (const f of req.files) {
      await PropertyPhoto.create({ propertyId: prop.id, rutaFoto: `properties/${f.filename}` });
    }
  }
  res.redirect('/owner/properties');
};

const getEdit = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const prop = await Property.findOne({ where: { id: req.params.id, ownerId: req.session.userId }, include: [{ model: PropertyPhoto, as: 'fotos' }] });
  if (!prop) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/owner/properties');
  }
  res.render('owner/edit', { prop });
};

const update = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const prop = await Property.findOne({ where: { id: req.params.id, ownerId: req.session.userId } });
  if (!prop) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/owner/properties');
  }
  const d = {
    titulo: req.body.titulo,
    tipo: req.body.tipo,
    habitaciones: req.body.habitaciones ? parseInt(req.body.habitaciones) : null,
    ubicacion: req.body.ubicacion,
    terraza: !!req.body.terraza,
    precio: req.body.precio ? parseInt(req.body.precio) : null,
    modalidad: req.body.modalidad,
    disponibleDesde: req.body.disponibleDesde || null,
    descripcion: req.body.descripcion,
  };
  await prop.update(d);
  if (req.files) {
    for (const f of req.files) {
      await PropertyPhoto.create({ propertyId: prop.id, rutaFoto: `properties/${f.filename}` });
    }
  }
  res.redirect('/owner/properties');
};

const remove = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const prop = await Property.findOne({ where: { id: req.params.id, ownerId: req.session.userId } });
  if (prop) {
    await prop.destroy();
  }
  res.redirect('/owner/properties');
};

const candidates = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const prop = await Property.findOne({ where: { id: req.params.id, ownerId: req.session.userId } });
  if (!prop) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/owner/properties');
  }
  const matches = await Match.findAll({
    where: { propertyId: prop.id, status: 'liked' },
    include: [{ model: User, include: [TenantProfile] }]
  });
  const profiles = matches
    .map(m => (m.User ? m.User.TenantProfile : null))
    .filter(Boolean);
  res.render('owner/candidates', { prop, candidates: profiles });
};

const ownerLikeTenant = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const propertyId = req.params.id;
  const prop = await Property.findOne({ where: { id: propertyId, ownerId: req.session.userId } });
  if (!prop) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/owner/properties');
  }
  const userId = req.params.userId;
  let m = await Match.findOne({ where: { propertyId, userId } });
  if (!m) {
    m = await Match.create({ propertyId, userId, status: 'liked' });
    req.flash('message', 'Interés registrado. Si el inquilino también te elige, habrá Match.');
  } else if (m.status === 'liked') {
    m.status = 'matched';
    await m.save();
    req.flash('message', '¡Se produjo un Match con el inquilino!');
  } else if (m.status === 'rejected') {
    m.status = 'liked';
    await m.save();
    req.flash('message', 'Se actualizó tu interés.');
  } else {
    req.flash('message', 'Ya tienes un Match con este inquilino.');
  }
  return res.redirect(`/owner/properties/${propertyId}/candidates`);
};

module.exports = {
  list,
  detail,
  matchesForTenant,
  like,
  ownerList,
  getNew,
  postNew,
  getEdit,
  update,
  remove,
  candidates,
  ownerLikeTenant,
};
