// 导入express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入数据验证功能中间件
const expressjoi = require('@escook/express-joi')

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证规则对象
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
// 导入头像验证规则对象
const { update_avatar_schema } = require('../schema/user')

// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户基本信息路由
router.post('/userinfo', expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码路由
router.post('/updatepwd', expressjoi(update_password_schema), userinfo_handler.updatePassword)

// 更新用户头像
router.post('/update/avatar',expressjoi(update_avatar_schema),userinfo_handler.updateAvatar)

// 向外暴露路由对象
module.exports = router