function enableCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  next()
}

module.exports = enableCors