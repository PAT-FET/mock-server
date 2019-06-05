const MockServer = require('../src/index')

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
