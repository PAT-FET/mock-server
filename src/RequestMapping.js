import Controller from './Controller'

const storage = {}

function getInst (clazz) {
  let collectionName = resolveCollectionName()
  let inst = storage[collectionName]
  if (inst) {
    if (inst instanceof clazz.constructor) return inst
    throw new Error(`duplicate collection name [${collectionName}]`)
  }
  inst = new clazz.constructor(collectionName)
  storage[collectionName] = inst
  return inst
  // take class name as collection name
  function resolveCollectionName () {
    return clazz.constructor.name
  }
}

const Mapping = function Mapping (options) {
  return function (target, name, descriptor) {
    if (!(target instanceof Controller)) return
    let inst = getInst(target)
    if (!options) throw new Error('url required')
    let url, method, cbs
    if (typeof options === 'string') url = options
    else {
      url = options.url
      method = options.method
      cbs = options.cbs
    }
    let handler = inst[name].bind(inst)
    register(target.constructor.name, url, method, cbs, handler)
  }

  function register (clzName, url, method, cbs, handler) {
    if (!url) throw new Error('register route fail, url required')
    if (!handler) throw new Error('register route fail, handler required')
    if (!method) method = 'all'
    method = method.toLowerCase()
    if (exist(url, method)) throw new Error(`route url [${url}], method [${method}] already registered`)
    ;(urlCache[url] || (urlCache[url] = {}))[method] = true
    ;(Mapping.registry[clzName] || (Mapping.registry[clzName] = [])).push({ url, method, cbs, handler })
    console.info(`registry (${clzName}): url [${url}], method [${method}]`.blue)
  }
}

const urlCache = {}

function exist (url, method) {
  let obj = urlCache[url]
  if (obj && (obj[method] || obj['all'])) return true
}

Mapping.registry = {}

export default Mapping
