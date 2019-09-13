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
