// 导入express模块
const express = require('express')
// 创建express服务器实例
const app = express()
// 导入模块
const joi = require('@hapi/joi')

// 导入cors中间件 解决跨域请求
const cors = require('cors')
// 将cors注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件 application/x-www-form-urlencoded (post)
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件
app.use(function (req, res, next) {
    // status=0 成功 1 为失败 默认为 1
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述
            message: err instanceof Error ? err.message : err
        })
    }
    // 传递给下一个中间件
    next()
})

// 解析token字符串放在路由之前，cc之后
// 导入配置文件 
const config = require('./config')
// 导包--解析token
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入第三方路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入个人中心路由模块
const userinfoRouter = require('./router/userinfo')
// 以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article',artCateRouter)

// 全局错误级别中间件 写在最下面
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // 捕获身份认证失败的错误 
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})

// 调用监听
app.listen(3007, function () {
    console.log('http://127.0.0.1:3007');
})