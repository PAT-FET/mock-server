import RequestMapping from './RequestMapping'
import ResData from './ResData'

function invoke (handler, req, res, context) {
  let result
  try {
    result = handler(req, res, context)
    if (result instanceof Promise) return result
    return Promise.resolve(result)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default function dispatch (context) {
  let { app, config } = context
  const routes = []
  Object.keys(RequestMapping.registry).forEach(key => {
    routes.push(...RequestMapping.registry[key])
  })
  routes.forEach(({ url, method, handler }) => {
    app[method](url, function (req, res) {
      invoke(handler, req, res, context).then(data => {
        res.send(config.transform(normalize(data))).end()
      }).catch(e => {
        console.log(e)
        res.send(config.transform(normalize(e))).end()
      })
    })
  })

  function normalize (result) {
    if (result instanceof ResData) return result
    if (result instanceof Error) return ResData.new(config.errorCode, result.message, null)
    return ResData.new(config.successCode, 'success', result)
  }
}
