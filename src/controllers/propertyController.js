const Property = require('../models/Property'); const TenantProfile = require('../models/TenantProfile'); const Match = require('../models/Match');
exports.list=async (req,res)=>{ const props=await Property.findAll({ order:[['id','DESC']] }); res.render('properties/list',{ props }); };
exports.detail=async (req,res)=>{ const p=await Property.findByPk(req.params.id); if(!p) return res.redirect('/properties'); res.render('properties/detail',{ p, message:req.flash('message') }); };
exports.like=async (req,res)=>{ if(!req.session.userId||req.session.role!=='tenant'){ req.flash('message','Debes ingresar como inquilino'); return res.redirect('/login'); }
 const propertyId=req.params.id;
 const property=await Property.findByPk(propertyId);
 if(!property) return res.redirect('/properties');
 let m=await Match.findOne({ where:{ userId:req.session.userId, propertyId } });
 if(!m){ m=await Match.create({ userId:req.session.userId, propertyId, status:'liked' }); req.flash('message','¡Enviado! Si el propietario también te elige, habrá Match.'); }
 else if(m.status==='liked'){ req.flash('message','Ya habías indicado interés por esta propiedad.'); }
 else if(m.status==='rejected'){ m.status='liked'; await m.save(); req.flash('message','Se actualizó tu interés.'); }
 else { req.flash('message','¡Ya hay Match en esta propiedad!'); } return res.redirect('/properties/'+propertyId); };
exports.ownerList=async (req,res)=>{ if(!req.session.userId||req.session.role!=='owner') return res.redirect('/login');
 const props=await Property.findAll({ where:{ ownerId:req.session.userId }, order:[['id','DESC']] }); res.render('owner/properties',{ props }); };
exports.getNew=(req,res)=>{ if(!req.session.userId||req.session.role!=='owner') return res.redirect('/login'); res.render('owner/new'); };
exports.postNew=async (req,res)=>{ if(!req.session.userId||req.session.role!=='owner') return res.redirect('/login');
 const { title,type,bedrooms,location,hasTerrace,price,modality,availableFrom,description }=req.body;
 await Property.create({ title,type, bedrooms:bedrooms?parseInt(bedrooms):null, location, hasTerrace:hasTerrace==='on',
  price:price?parseInt(price):null, modality, availableFrom, description, ownerId:req.session.userId });
 res.redirect('/owner/properties'); };
exports.candidates=async (req,res)=>{ if(!req.session.userId||req.session.role!=='owner') return res.redirect('/login');
 const propertyId=req.params.id; const prop=await Property.findOne({ where:{ id:propertyId, ownerId:req.session.userId } }); if(!prop) return res.redirect('/owner/properties');
 const all=await TenantProfile.findAll({ include: [] });
 const filtered=all.filter(t=>{ 
   const okLoc=!t.locations|| (prop.location && t.locations.split(',').map(s=>s.trim().toLowerCase()).includes(prop.location.toLowerCase()));
   const okBeds=!t.bedrooms|| (''+t.bedrooms).toLowerCase().includes((''+(prop.bedrooms||'')).toLowerCase()) || (t.bedrooms==='Estudio' && (!prop.bedrooms || prop.bedrooms===0));
   const okTer=!t.terrace|| t.terrace==='Indiferente'|| (t.terrace==='Si' && !!prop.hasTerrace) || (t.terrace==='No' && !prop.hasTerrace);
   const okBudget=!t.budget|| !prop.price || prop.price<=t.budget;
   const okMod=!t.modality|| t.modality==='Indiferente'|| !prop.modality || t.modality===prop.modality;
   return okLoc && okBeds && okTer && okBudget && okMod; 
 });
 res.render('owner/candidates',{ prop, candidates: filtered }); };
exports.ownerLikeTenant=async (req,res)=>{ if(!req.session.userId||req.session.role!=='owner') return res.redirect('/login');
 const propertyId=req.params.id; const userId=req.params.userId; const prop=await Property.findOne({ where:{ id:propertyId, ownerId:req.session.userId } }); if(!prop) return res.redirect('/owner/properties');
 let m=await Match.findOne({ where:{ userId, propertyId } }); if(!m){ m=await Match.create({ userId, propertyId, status:'liked' }); }
 else if(m.status==='liked'){ m.status='matched'; await m.save(); }
 req.flash('message','Preferencia guardada.'); res.redirect(`/owner/properties/${propertyId}/candidates`); };
exports.matchesForTenant=async (req,res)=>{ if(!req.session.userId||req.session.role!=='tenant') return res.redirect('/login');
 const matches=await Match.findAll({ where:{ userId:req.session.userId, status:'matched' } }); res.render('tenant/matches',{ matches }); };
