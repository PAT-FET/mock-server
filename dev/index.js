const MockServer = require('../src/runner')

MockServer.Controller.inits = MockServer.requireAll({ dirname: __dirname + '/inits' })

MockServer.requireAll({ dirname: __dirname + '/controllers' })

const config = {
  auth: {
    token: {
      enabled: false
    }
  }
}

const server = new MockServer(config)

server.run()
