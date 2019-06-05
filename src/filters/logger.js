const logger = ({ config }) => {
  return function (req, res, next) {
    const from = req.headers.host
    const url = req.url
    const method = req.method
    const query = req.query
    const body = req.body

    console.log('\n')
    console.info(`---------------------------------------------`.white)
    console.log('\n')
    console.group(`request: ${new Date()}`.green)
    console.info(`from: ${from}`.green)
    console.info(`url: ${url}`.green)
    console.info(`method: ${method}`.green)
    if (query) console.log('query: '.green, prettifyText(query))
    if (body) console.log('body: '.green, prettifyText(body))
    console.log('\n')
    console.info(`---------------------------------------------`.white)
    console.log('\n')
    console.groupEnd()
    next()
  }

  function prettifyText (text) {
    if (Object.prototype.toString.call(text) === '[object Object]') {
      return JSON.stringify(text, null, 2)
    }
    return text
  }
}

export default logger
