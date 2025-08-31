const TenantProfile = require("../models/TenantProfile");
const Property = require("../models/Property"); // Asegúrate de tener este modelo
const { Op } = require("sequelize");

// -------------------- UTILIDADES GENERALES --------------------

function safeParseJson(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function mapPropertyForClient(p) {
  if (!p) return null;

  let photos =
    p.photos ??
    p.images ??
    p.Photos ??
    p.Images ??
    null;

  if (typeof photos === "string") photos = safeParseJson(photos);
  if (!Array.isArray(photos)) photos = [];

  return {
    id: String(p.id),
    photos,
    sizeM2: p.sizeM2 ?? p.m2 ?? p.squareMeters ?? null,
    bedrooms: p.bedrooms ?? p.rooms ?? 0,
    stayType: p.stayType ?? p.modality ?? "",
    neighborhood: p.neighborhood ?? p.location ?? "",
    terrace: p.terrace ?? p.hasTerrace ?? null,
    availableFrom: p.availableFrom ?? p.disponibleDesde ?? null,
    price: p.price ?? p.rent ?? null,
  };
}

/**
 * Construye el "where" de Sequelize según el perfil del inquilino
 * Ajusta los nombres de campos a los de tu Property real.
 */
async function buildWhereForUser(req) {
  const where = { published: true };

  const profile = await TenantProfile.findOne({
    where: { userId: req.session.userId },
    raw: true,
  });

  if (profile) {
    // >= dormitorios
    if (profile.bedrooms) {
      where.bedrooms = { [Op.gte]: Number(profile.bedrooms) };
    }

    // <= presupuesto
    if (profile.budget) {
      where.price = { [Op.lte]: Number(profile.budget) };
    }

    // locations puede venir CSV o JSON-string
    let locations = profile.locations;
    if (typeof locations === "string" && locations.includes(",")) {
      locations = locations.split(",").map(s => s.trim()).filter(Boolean);
    } else if (typeof locations === "string") {
      try {
        const parsed = JSON.parse(locations);
        if (Array.isArray(parsed)) locations = parsed;
      } catch { /* ignore */ }
    }
    if (Array.isArray(locations) && locations.length) {
      where.neighborhood = { [Op.in]: locations };
    }

    if (profile.propertyType) where.propertyType = profile.propertyType;
    if (profile.modality) where.stayType = profile.modality;
    if (profile.terrace !== undefined && profile.terrace !== null) {
      where.terrace = !!profile.terrace;
    }
  }

  return where;
}

function getSafeOrderForProperty(PropertyModel) {
  // intenta ordenar por createdAt; si no existe, por updatedAt; si no, por id
  if (PropertyModel?.rawAttributes?.createdAt) return [["createdAt", "DESC"]];
  if (PropertyModel?.rawAttributes?.updatedAt) return [["updatedAt", "DESC"]];
  return [["id", "DESC"]];
}

async function getCandidateIds(req) {
  const where = await buildWhereForUser(req);
  const order = getSafeOrderForProperty(Property);

  const props = await Property.findAll({
    where,
    order,
    attributes: ["id"],
    raw: true,
  });

  return props.map(p => String(p.id));
}

async function getPropertyById(id) {
  return Property.findByPk(id, { raw: true });
}

async function nextPropertyForUser(req) {
  req.session.cursor = (req.session.cursor ?? 0) + 1;

  if (!req.session.candidates || req.session.cursor >= req.session.candidates.length) {
    return null; // fin de la cola (puedes reconstruir aquí si quieres)
  }

  const nextId = req.session.candidates[req.session.cursor];
  if (!nextId) return null;
  return getPropertyById(nextId);
}

// -------------------- CONTROLADORES EXISTENTES --------------------

exports.dashboard = async (req, res) => {
  res.render("tenant/dashboard", { baseUrl: req.baseUrl });
};

exports.getStep1 = async (req, res) => {
  const profile = await TenantProfile.findOne({
    where: { userId: req.session.userId },
  });

  res.render("tenant/step1", { profile, baseUrl: req.baseUrl });
};

exports.postStep1 = async (req, res) => {
  const {
    profession,
    seniority,
    salary,
    legalStatus,
    nationality,
    pets,
    roommates,
  } = req.body;

  const d = {
    profession,
    seniority,
    salary,
    legalStatus,
    nationality,
    pets,
    roommates,
  };

  let p = await TenantProfile.findOne({ where: { userId: req.session.userId } });
  if (p) await p.update(d);
  else p = await TenantProfile.create({ ...d, userId: req.session.userId });

  res.redirect(`${req.baseUrl}/onboarding/step2`);
};

exports.getStep2 = async (req, res) => {
  const profile = await TenantProfile.findOne({
    where: { userId: req.session.userId },
  });
  res.render("tenant/step2", { profile, baseUrl: req.baseUrl });
};

exports.postStep2 = async (req, res) => {
  const {
    propertyType,
    bedrooms,
    locations,
    terrace,
    budget,
    modality,
    moveIn,
    status,
  } = req.body;

  const d = {
    propertyType,
    bedrooms,
    locations,
    terrace,
    budget,
    modality,
    moveIn,
    status,
  };

  let p = await TenantProfile.findOne({ where: { userId: req.session.userId } });
  if (p) await p.update(d);
  else await TenantProfile.create({ ...d, userId: req.session.userId });

  res.redirect(`${req.baseUrl}/onboarding/step3`);
};

exports.getStep3 = async (req, res) => {
  const profile = await TenantProfile.findOne({
    where: { userId: req.session.userId },
  });
  res.render("tenant/step3", { profile, baseUrl: req.baseUrl });
};

exports.postStep3 = async (req, res) => {
  const p = await TenantProfile.findOne({
    where: { userId: req.session.userId },
  });
  if (!p) return res.redirect("/tenant/onboarding/step2?error=profile");

  await p.update({
    linkedinUrl: req.body.linkedinUrl,
    idDocPath: req.files?.idDoc?.[0]?.path,
    lastPayslipPath: req.files?.lastPayslip?.[0]?.path,
    workContractPath: req.files?.workContract?.[0]?.path,
    cvPath: req.files?.cv?.[0]?.path,
    selfiePath: req.files?.selfie?.[0]?.path,
    isValidated: !!(
      req.files?.idDoc ||
      req.files?.lastPayslip ||
      req.files?.workContract
    ),
  });

  res.redirect(`${req.baseUrl}/onboarding/done`);
};

exports.done = (req, res) => {
  res.render("tenant/done", { baseUrl: req.baseUrl });
};

// -------------------- NUEVO: FLUJO "TINDER" --------------------

/**
 * GET /tenant/finds
 * Renderiza la primera propiedad candidata
 */
exports.getFinds = async (req, res, next) => {
  try {
    if (!req.session.candidates || !Array.isArray(req.session.candidates) || req.session.candidates.length === 0) {
      req.session.candidates = await getCandidateIds(req);
      req.session.cursor = 0;
    }

    const { candidates, cursor } = req.session;
    const currentId = candidates?.[cursor];

 let propertyRaw = null;
if (currentId) {
  propertyRaw = await getPropertyById(currentId);
}
const property = mapPropertyForClient(propertyRaw);

res.render("tenant/finds", {
  title: "Encuentra tu piso",
  property,                         // <- ya viene normalizado
  hasMore: Boolean(property),
  baseUrl: req.baseUrl || "/tenant",
});

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/matches/:propertyId/like
 */
exports.likeProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // TODO: Guardar el like en DB si quieres:
    // await Like.create({ userId: req.session.userId, propertyId });

    const nextProp = await nextPropertyForUser(req);
    return res.json({ ok: true, next: mapPropertyForClient(nextProp) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/matches/:propertyId/reject
 */
exports.rejectProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // TODO: Guardar el rechazo si quieres:
    // await Reject.create({ userId: req.session.userId, propertyId });

    const nextProp = await nextPropertyForUser(req);
    return res.json({ ok: true, next: mapPropertyForClient(nextProp) });
  } catch (err) {
    next(err);
  }
};