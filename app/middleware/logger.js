function log(req, res, next) {
  console.log("loggggggggg");
  next();
}

module.exports = log;