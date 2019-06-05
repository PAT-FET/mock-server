import { Controller, RequestMapping } from '../../src/index'

export default class users extends Controller{

  @RequestMapping('/users')
  getUsers (req, res, context) {
    return this.collection.find()

  }

  @RequestMapping({url: '/login', method: 'post'})
  login (req, res, context) {
    let username = req.body.username
    let user = this.collection.find({username})[0]
    if (!user) throw new Error('未找到用户: ' + username)
    let token = context.authService.setAuth(req, user)
    return token
  }

  @RequestMapping({url: '/logout', method: 'post'})
  logout (req, res, context) {
    context.authService.clear(req)
  }
}
