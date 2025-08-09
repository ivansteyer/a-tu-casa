exports.dashboard = (req, res) => {
  if (!req.session.userId || req.session.role !== 'owner') {
    return res.redirect('/login');
  }
  res.render('owner/dashboard');
};