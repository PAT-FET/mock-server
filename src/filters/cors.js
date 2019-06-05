function tokenHeader (config) {
  let key = config.auth && config.auth.token && config.auth.token.key
  if (key) return `,${key}`
  return ''
}

const cors = ({ config }) => {
  return function (req, res, next) {
    const origin = req.headers.origin
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS')
    res.header('Access-Control-Allow-Headers', resolveAllowHeaders())
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method.toUpperCase() === 'OPTIONS') {
      res.status(200).end()
      return
    }
    next()
  }

  function resolveAllowHeaders () {
    let headers = config.cors.allowHeaders
    if (headers === '*') return headers
    return headers + tokenHeader(config)
  }
}

export default cors
