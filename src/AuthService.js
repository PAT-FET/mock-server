const tokenStorage = {}

export default class AuthService {
  constructor (config) {
    this.config = config
  }

  get needAuth () {
    return this.config.auth && this.config.auth.enabled
  }

  get needToken () {
    return this.needAuth && this.config.auth.token && this.config.auth.token.enabled
  }

  get tokenKey () {
    return this.needToken && this.config.auth.token.key
  }

  get userId () {
    return this.needAuth && this.config.auth.userId
  }

  access (req) {
    let config = this.config
    const whiteList = config.auth && config.auth.whiteList
    if (!this.needAuth) return true // 禁用验证
    if (onWhiteList(req.url, whiteList)) return true
    if (!req.session.user) {
      throw new Error('session expired')
    }
    if (this.needToken && !checkToken(req, this.tokenKey, this.userId)) {
      throw new Error('token check error')
    }
    return true
  }

  setAuth (req, auth) {
    const self = this
    req.session.user = auth
    if (this.needToken) return generateToken()

    function generateToken () {
      let username = auth[self.userId]
      let token = username + '_' + Date.now()
      tokenStorage[username] = token
      return tokenStorage[username]
    }
  }

  getAuth (req) {
    return req.session.user
  }

  clear (req) {
    const userId = this.config.auth && this.config.auth.userId
    let username = req.session && req.session.user && req.session.user[userId]
    if (username) delete tokenStorage[username]
    req.session.destroy()
  }
}

function checkToken (req, key, userId) {
  let username = req.session && req.session.user && req.session.user[userId]
  if (!username) return false
  let clientToken = req.headers[key]
  if (!clientToken) {
    console.error(`未获取到客户端token, 请确保key: ${key}`)
    return false
  }
  let serverToken = tokenStorage[username]
  if (!serverToken) {
    console.error(`未监测到服务端token`)
    return false
  }
  return simpleCheck(clientToken, serverToken)

  // just check these two token whether identical,
  // if they're not, check fail.
  // you can overwrite this implement more advance future
  function simpleCheck (clientToken, serverToken) {
    return clientToken === serverToken
  }
}

function onWhiteList (url, whiteList = []) {
  return whiteList.some(v => {
    let pureUrl = resolveUrl(url)
    const convertRegEx = (expr) => {
      return new RegExp('^' +
        (expr || '')
          .replace(/\*\*/g, '#__#')
          .replace(/\*/g, '[^/]*')
          .replace(/#__#/g, '.*') +
        '$')
    }
    return convertRegEx(v).test(pureUrl)
  })
  function resolveUrl (url) {
    if (!url) return '/'
    let suffixIdx = url.indexOf('?')
    return url.substr(0, suffixIdx === -1 ? undefined : suffixIdx)
  }
}
