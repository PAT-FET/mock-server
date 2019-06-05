export default function () {
  return {
    // host: 'localhost',
    port: 3000,
    session: {
      secret: 'mock',
      name: 'sid',
      cookie: { maxAge: 30 * 60 * 1000 }, // 30 min
      resave: false,
      saveUninitialized: false
    },
    transform: function transform ({ code, data, msg }) {
      return {
        data: data,
        resultCode: code,
        resultMesg: msg
      }
    },
    successCode: '000000',
    errorCode: '-1',
    auth: {
      enabled: true,
      whiteList: ['/login', '/logout'],
      token: {
        enabled: true,
        key: 'X-Token'
      },
      userId: 'username'
    },
    cors: {
      allowHeaders: 'Content-Type'
    }
  }
}
