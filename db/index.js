// 导入mysql模块
const mysql = require('mysql')

// 创建数据库连接
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'an'
})

// 测试 mysql 模块能否正常工作
// db.query('select 1',(err,results)=>{
//     if(err) {
//         return console.log(err.message);
//     }
//     // [ RowDataPacket { '1': 1 } ] 打印出就证明数据库连接正常
//     console.log(results);
// })

// 向外共享 db 数据库连接对象
module.exports = db