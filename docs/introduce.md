### MockServer 是什么

`MockServer` 是一个提供模拟数据服务的框架，为web应用提供模拟后台，从提供最简单的数据模拟，
到复杂的场景


### 概念

路由被指定在类的每个方法上， 我们在这里称该类为一个实体， 每个类拥有一个数据集, 会自动为该类生成一个与类名相同名称的集合，
如果指定了初始化文件夹， 将在该文件夹下搜索与类型相同的文件作为初始化脚本。


### 与 EasyMock 比较
`easy mock` 更多的是一个发布前后端接口契约的服务，而对于前端开发集成测试中，数据模拟的灵活性、
以及数据的独立性是可能不满足要求的，`MockServer` 关注数据的模拟而不是接口定义

### 起步

`index.js`

```js
const MockServer = require('@pat-fet/mock-server')

// 导入初始化数据
MockServer.Controller.inits = MockServer.requireAll({ dirname: __dirname + '/inits' })

// 导入控制器
MockServer.requireAll({ dirname: __dirname + '/controllers' })

// 配置
const config = {
  auth: {
    token: {
      enabled: false
    }
  }
}

const server = new MockServer(config)

server.run()
```


`controllers/users.js`

```js
import { Controller, RequestMapping } from '@pat-fet/mock-server'

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

```


`inits/users.js`

```js
// 支持 module.exports
export default [
  {
    username: 'Alison',
    age: 23
  }
]
```


 [查看示例](https://github.com/PAT-FET/mock-server-demo)


 ### 特性

 - `ES6` 语法支持, 使用了`babel`, 可以自由的使用 `import/export` 等语法

 - 自动导入控制器与初始化脚本
    - 你无需一个一个导入你声明文件，使用`MockServer.requireAll` 将一次性导入

 - 使用注解的`url`路由派发
    - 使用 `@RequestMapping` 配置路由

 - 返回结果自动包装 与 异步支持
    - 将返回的数据 转化成 `ResData`， 也可以返回一个Promise实现异步效果

 - 认证服务
    - 提供 `authService` 认证服务， 包括白名单、登录、登出、token

 - 数据持久化
    - 使用 `loki` 作为内存数据库， 可实现数据持久化以及关联查询

 - 高度可配置化
    - 提供配置项， 可按需重载特定的配置项

- 文件上传支持, 基于`multer`插件

- 支持proxy配置， 可实现模拟数据与真实数据混合使用


### 文件上传下载

```js
import { Controller, RequestMapping, upload } from '../../src/index'
import fs from 'fs'
import path from 'path'

function generateUuid () {
  return Date.now() + ''
}

export default class nas extends Controller{

  @RequestMapping({ url: '/nas', method: 'post', cbs: upload.single('file')})
  upload (req, res, context) {
    let file = req.file
    let uuid = generateUuid()
    let name = file.originalname
    let size = file.size
    let model = {uuid, name, size}
    let p = path.join(__dirname, '../nas', uuid)
    fs.writeFile(p, file.buffer, function (err) {
      if (err) throw err
    })
    this.collection.insert(model)
    return uuid
  }

  @RequestMapping({ url: '/nas/:uuid', method: 'get' })
  download(req, res, context) {
    let uuid = req.params.uuid
    let file = this.collection.find({ uuid })[0]
    if (!file) throw new Error('file not exists')
    let p = path.join(__dirname, '../nas', uuid)
    let name = file.name
    return new Promise((resolve, reject) => {
      res.download(p, name, function (err) {
        if (err) throw err
      })
    })
  }
}

```


