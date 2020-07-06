const MockServer = require('../src/index')

// 导入初始化数据
MockServer.Controller.inits = MockServer.requireAll({ dirname: __dirname + '/inits' })

// 导入控制器
MockServer.requireAll({ dirname: __dirname + '/controllers' })

// 配置
const config = {
  port: 3001,
  auth: {
    enabled: false
  },
  proxy: {
    '/baidu': {
      target: 'www.baidu.com',
      options: {}
    }
  }
}

const server = new MockServer(config)

server.run()
