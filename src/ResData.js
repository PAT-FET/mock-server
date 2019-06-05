export default class ResData {
  constructor (code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
  }
}

ResData.new = (code, msg, data) => new ResData(code, msg, data)
