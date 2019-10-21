module.exports = function(req, res, next) {
  req.filesPaths = [];
  next();
};
//this middleware pupose is to create an empty array for each request where we can add later the link multer saved the file in
