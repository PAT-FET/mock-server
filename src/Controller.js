import db from './db'

let cache = new Set()

export default class Controller {
  constructor (collectionName) {
    if (!collectionName) throw new Error('collection name required')
    if (cache.has(collectionName)) throw new Error(`already exist collection name [${collectionName}]`)
    cache.add(collectionName)
    this.db = db
    this.collection = db.addCollection(collectionName)
    this.init()
  }
  init () {
    if (Controller.inits) {
      let data = Controller.inits[this.collection.name]
      data = data.default || data // 兼容 export
      if (data && Array.isArray(data)) {
        data.forEach(v => this.collection.insert(v))
      }
    }
  }
  getCollection (collectionName) {
    return this.db.collections.find(collection => collection.name === collectionName)
  }
}
