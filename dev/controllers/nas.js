import { Controller, RequestMapping, upload } from '../../src/index'

export default class nas extends Controller{

  @RequestMapping({ url: '/nas', method: 'post', cbs: upload.array('files', 1)})
  upload (req, res, context) {
    console.log(req.files)
  }
}
