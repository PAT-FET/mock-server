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

  function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
}

let target = {
  server: {
    host: 'localhost',
    port: 8000
  },
  logger: {
    level: 0
  }
}

let source = {
  server: {
    port: 3000
  },
  logger: null,
  more: {

  }
}

deepOverwrite(target, source)

console.log(target)
