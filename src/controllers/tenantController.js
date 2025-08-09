const TenantProfile = require('../models/TenantProfile');
exports.ensureAuth=(req,res,next)=>{ if(!req.session.userId||req.session.role!=='tenant') return res.redirect('/login'); next(); };
exports.dashboard=async (req,res)=>{ res.render('dashboard'); };
exports.getStep1=async (req,res)=>{ const profile=await TenantProfile.findOne({ where:{ userId:req.session.userId } }); res.render('tenant/step1',{ profile }); };
exports.postStep1=async (req,res)=>{ const d=(({profession,seniority,salary,legalStatus,nationality,pets,roommates})=>({profession,seniority,salary,legalStatus,nationality,pets,roommates}))(req.body);
 let p=await TenantProfile.findOne({ where:{ userId:req.session.userId } }); if(p) await p.update(d); else p=await TenantProfile.create({ ...d, userId:req.session.userId });
 res.redirect('/onboarding/step2'); };
exports.getStep2=async (req,res)=>{ const profile=await TenantProfile.findOne({ where:{ userId:req.session.userId } }); res.render('tenant/step2',{ profile }); };
exports.postStep2=async (req,res)=>{ const d=(({propertyType,bedrooms,locations,terrace,budget,modality,moveIn,status})=>({propertyType,bedrooms,locations,terrace,budget,modality,moveIn,status}))(req.body);
 let p=await TenantProfile.findOne({ where:{ userId:req.session.userId } }); await p.update(d); res.redirect('/onboarding/step3'); };
exports.getStep3=async (req,res)=>{ const profile=await TenantProfile.findOne({ where:{ userId:req.session.userId } }); res.render('tenant/step3',{ profile }); };
exports.postStep3=async (req,res)=>{ const p=await TenantProfile.findOne({ where:{ userId:req.session.userId } });
 await p.update({ linkedinUrl:req.body.linkedinUrl, idDocPath:req.files?.idDoc?.[0]?.path, lastPayslipPath:req.files?.lastPayslip?.[0]?.path,
 workContractPath:req.files?.workContract?.[0]?.path, cvPath:req.files?.cv?.[0]?.path, selfiePath:req.files?.selfie?.[0]?.path,
 isValidated: !!(req.files?.idDoc || req.files?.lastPayslip || req.files?.workContract) }); res.redirect('/onboarding/done'); };
exports.done=(req,res)=> res.render('tenant/done');
