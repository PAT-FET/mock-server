### MockServer

#### 静态属性

- `MockServer.Controller : class`

    - `db` 数据库示例
    - `collection` 当前类所属集合
    - `getCollection(name: string)` 获取特定集合

    路由处理函数：
        foo (req, res, context)
        - req - `express` 的 req 对象
        - res - `express` 的 res 对象
        - context - `MockServer` 对象


- `MockServer.RequestMapping : (options) => void`

    - options : string | {url, method}


- `MockServer.requireAll : (options) => void`

    - options : any

    *参考 `require-all` 第三方库*


- `MockServer.ResData : class`

    - ResData.new : (code, msg, data) => ResData

    - code: string

    - msg: string

    - data: any


#### 实例属性

- `config`  配置项

- `app`  express服务示例

- `authService` 认证服务




### AuthService

 - `access: (req) => void throw Error` 是否在白名单

 - `setAuth: (req, user) => void` 设置认证实体

 - `getAuth: (req) => any` 获取认证实体

 - `clear: () => void` 清空认证信息

