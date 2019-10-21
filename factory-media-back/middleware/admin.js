module.exports = function(req, res, next) {
  // 401 unauthorized  protected route
  // 403 forbiden for the current user
  if (!req.user.role) return res.status(403).status("Acces denied");
  next();
};
