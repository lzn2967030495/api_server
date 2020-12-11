// 导入数据库操作模块
const db = require('../db/index')
// 导入包 验证密码是否一致
const bcrypt = require('bcryptjs')

// 获取用户基本信息处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的sql语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    // 调用 db.query() 执行 SQL 语句：
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功 但行数不等于1
        if (results.length !== 1) {
            return res.cc('获取用户信息失败')
        }
        // 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })

}

// 更新用户基本信息处理函数
exports.updateUserInfo = (req, res) => {
    // 定义执行的sql语句
    const sql = 'update ev_users set ? where id=?'
    // 执行sql
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功 但是不影响行数
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改成功
        return res.cc('修改用户信息成功！', 0)
    })
}

// 重新密码处理函数
exports.updatePassword = (req, res) => {
    // 根据id查询数据
    const sql = 'select * from ev_users where id=?'
    // 执行ssql语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 检测用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')
        // res.send(results[0])

        // 判断提交的旧密码是否正确
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确 
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        // 对新密码进行 bcrypt 加密之后，更新到数据库中
        const sql = 'update ev_users set password=? where id=? '
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行sql语句 根据id更新用户密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err)
            // sql执行成功 不影响行数
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败！')
            }
            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新头像的sql语句
    const sql = 'update ev_users set user_pic=? where id=?'
    // 调用
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败 
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1 
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        // 更新用户头像成功 
        return res.cc('更新头像成功！', 0)
    })
}
