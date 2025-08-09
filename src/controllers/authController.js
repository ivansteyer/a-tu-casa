const bcrypt = require('bcrypt'); const User = require('../models/User');
exports.getLogin=(req,res)=> res.render('login',{ message:req.flash('message') });
exports.postLogin=async (req,res)=>{ const { email,password }=req.body; const user=await User.findOne({ where:{ email } });
 if(!user){ req.flash('message','Usuario no encontrado'); return res.redirect('/login'); }
 const ok=await bcrypt.compare(password,user.passwordHash);
 if(!ok){ req.flash('message','Credenciales inválidas'); return res.redirect('/login'); }
 req.session.userId=user.id; req.session.role=user.role; res.redirect('/dashboard'); };
exports.getRegister=(req,res)=> res.render('register',{ message:req.flash('message') });
exports.postRegister=async (req,res)=>{ const {name,email,password,role}=req.body;
 const exists=await User.findOne({ where:{ email } }); if(exists){ req.flash('message','El email ya está registrado'); return res.redirect('/register'); }
 const passwordHash=await bcrypt.hash(password,10); const user=await User.create({ name,email,passwordHash,role });
 req.session.userId=user.id; req.session.role=user.role; res.redirect('/onboarding/step1'); };
exports.logout=(req,res)=>{ req.session.destroy(()=>res.redirect('/')); };
