const auth = ({ config, authService }) => {
  return function (req, res, next) {
    try {
      authService.access(req)
      next()
    } catch (e) {
      res.status(401).send(e.message).end()
    }
  }
}

export default auth
