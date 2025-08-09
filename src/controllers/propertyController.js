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