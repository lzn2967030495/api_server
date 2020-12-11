// 导入第三方数据库
const db = require('../db/index')
// 导入加密包
const bcrypt = require('bcryptjs')
// 导入js包
// 用这个包来生成 Token 字符串 
const jwt = require('jsonwebtoken')
// 导入配置第三方文件
const config = require('../config')


// 导出注册新用户
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息 post 使用body来接收数据
    const userinfo = req.body
    // // 对表单中的数据，进行合法校验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不能为空'
    //     // })
    //     return res.cc('用户名或密码不能为空')
    // }
    // 查询用户是否存在
    const sql = 'select * from ev_users where username=?'
    db.query(sql, [userinfo.username], function (err, results) {
        // 执行sql语句失败
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用,请更换其他用户名！'
            // })
            return res.cc('用户名被占用,请更换其他用户名！')
        }
        // res.send('用户注册成功')

        // 后续流程
        // 对密码进行加密处理
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo.password);  随机盐

        // 定义插入的新用户sql语句
        const sql = 'insert into ev_users set ?'
        // 调用db.query() 执行sql语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行sql语句
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            // 执行成功 行数不为1 插入失败
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后重试' })
                return res.cc('注册用户失败，请稍后重试')
            }
            // 注册成功
            // res.send({ status: 0, message: '注册成功' })
            return res.cc('注册成功', 0)
        })
    })
}

// 导出登录
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义 SQL 语句
    const sql = 'select * from ev_users where username=?'
    // 执行 SQL 语句，查询用户的数据
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        if (results.length !== 1) {
            // 执行 SQL 语句成功，但是查询到数据条数不等于 1
            return res.cc('该用户名不存在，请确认后再登录')

        }
        // res.send('login OK')
        // 判断用户输入的登录密码是否和数据库中的密码一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('密码错误,请重新输入')
        }
        // 登录成功，生成 Token 字符串
        // 清除头像密码
        const user = { ...results[0], password: '', user_pic: '' }
        // console.log(user);
        // 将用户信息对象加密成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            // 有效期 token 有效期为 10 个小时
            expiresIn: '10h'
        })
        // 将生成的 Token 字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer' + tokenStr
        })
    })
}
