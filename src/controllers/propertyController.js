const Property = require('../models/Property');
// Si todavía no usas la tabla de fotos, puedes comentar esta línea:
// const PropertyPhoto = require('../models/PropertyPhoto');
const Match = require('../models/Match');
const TenantProfile = require('../models/TenantProfile');
const User = require('../models/User');

/**
 * Parse safe del TEXT photos -> array de strings
 */
function toPlainWithPhotos(modelOrPlain) {
  const p = modelOrPlain?.get ? modelOrPlain.get({ plain: true }) : modelOrPlain;
  let photosArr = [];
  try {
    if (p && p.photos) {
      const parsed = JSON.parse(p.photos);
      if (Array.isArray(parsed)) photosArr = parsed;
    }
  } catch (_) {}
  return { ...p, photosArr };
}

const list = async (req, res) => {
  const rows = await Property.findAll({
    order: [['createdAt', 'DESC']],
  });
  const props = rows.map(toPlainWithPhotos);
  res.render('properties/list', { props });
};

const detail = async (req, res) => {
  const row = await Property.findByPk(req.params.id);
  if (!row) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/properties');
  }
  const p = toPlainWithPhotos(row);
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
  const rows = await Property.findAll({
    where: { ownerId: req.session.userId },
    order: [['createdAt', 'DESC']],
  });
  const props = rows.map(toPlainWithPhotos);
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

  // Construimos URLs de fotos para guardar también en properties.photos (JSON)
  const photoUrls = (req.files || []).map(f => `properties/${f.filename}`);

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
    m2: req.body.m2 ? parseInt(req.body.m2) : null,
    ascensor: !!req.body.ascensor,
    altura: req.body.altura ? parseInt(req.body.altura) : null,
    // Guardamos también el JSON como fallback para no depender del JOIN
    photos: photoUrls.length ? JSON.stringify(photoUrls) : null,
    
  };

  const prop = await Property.create(d);

  // Si tienes la tabla property_photos, seguimos creando registros. Si no existe, no rompemos.
  try {
    const PropertyPhoto = require('../models/PropertyPhoto');
    if (photoUrls.length && PropertyPhoto?.bulkCreate) {
      await PropertyPhoto.bulkCreate(
        photoUrls.map((rutaFoto, i) => ({
          propertyId: prop.id,
          rutaFoto,
          orden: i,
        }))
      );
    }
  } catch (e) {
    // Silencioso: si no existe el modelo/tabla, seguimos sin fallar.
  }

  res.redirect('/owner/properties');
};

const getEdit = async (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  const row = await Property.findOne({
    where: { id: req.params.id, ownerId: req.session.userId },
  });
  if (!row) {
    req.flash('message', 'Propiedad no encontrada');
    return res.redirect('/owner/properties');
  }
  const prop = toPlainWithPhotos(row);
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
    m2: req.body.m2 ? parseInt(req.body.m2) : null,
    ascensor: !!req.body.ascensor,
    altura: req.body.altura ? parseInt(req.body.altura) : null,
  };

  // Nuevas fotos subidas en esta edición
  const newPhotoUrls = (req.files || []).map(f => `properties/${f.filename}`);

  // Mezclamos con las fotos existentes del JSON
  let currentPhotos = [];
  try {
    if (prop.photos) {
      const parsed = JSON.parse(prop.photos);
      if (Array.isArray(parsed)) currentPhotos = parsed;
    }
  } catch (_) {}

  const mergedPhotos = [...currentPhotos, ...newPhotoUrls];
  d.photos = mergedPhotos.length ? JSON.stringify(mergedPhotos) : null;

  await prop.update(d);

  // Intento opcional de crear también en property_photos (si existe)
  try {
    const PropertyPhoto = require('../models/PropertyPhoto');
    if (newPhotoUrls.length && PropertyPhoto?.bulkCreate) {
      // calcular índice de orden inicial según cuántas había
      const start = currentPhotos.length;
      await PropertyPhoto.bulkCreate(
        newPhotoUrls.map((rutaFoto, i) => ({
          propertyId: prop.id,
          rutaFoto,
          orden: start + i,
        }))
      );
    }
  } catch (e) {
    // Silencioso si la tabla no existe.
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