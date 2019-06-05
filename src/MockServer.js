import 'colors'

import defaultConfig from './config'
import Express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import dispatch from './dispatch'

import cors from './filters/cors'
import auth from './filters/auth'
import logger from './filters/logger'

import Controller from './Controller'
import RequestMapping from './RequestMapping'
import requireAll from 'require-all'
import ResData from './ResData'

import AuthService from './AuthService'

function deepOverwrite (target, source) {
  Object.keys(target).forEach(key => {
    let t = target[key]
    let s = source && source[key]
    if (isObject(t)) {
      if (isObject(s)) {
        deepOverwrite(t, s)
      } else if (s !== undefined) {
        target[key] = s
      }
    } else {
      if (s !== undefined) target[key] = s
    }
  })
  return target

  function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
}

export default class MockServer {
  constructor (config) {
    this.config = deepOverwrite(defaultConfig(), config || {})
    this.app = new Express()
    this.authService = new AuthService(this.config)
    this.init()
  }

  init () {
    this.app.use(cors(this))
    this.app.use(cookieParser())
    this.app.use(session(this.config.session))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.raw())
    this.app.use(logger(this))
    this.app.use(auth(this))
    dispatch(this)
  }

  run () {
    this.app.listen(this.config.port, function () {
      const host = this.address().address
      const port = this.address().port
      console.log('Mock Server listening at http://%s:%s', host, port)
    })
  }
}

MockServer.Controller = Controller
MockServer.RequestMapping = RequestMapping
MockServer.requireAll = requireAll
MockServer.ResData = ResData
