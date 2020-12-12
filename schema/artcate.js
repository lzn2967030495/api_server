// 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 定义分类名称 和 分类别名的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 校验规则
exports.add_cate_schema = {
    body: {
        name: name,
        alias: alias,
    }
}

// id的校验规则
const id = joi.number().integer().min(1).required()

// 向外导出
exports.delete_cate_schema = {
    params:{
        id
    }
}

// 验证表单数据
exports.get_cate_schema = {
    params:{
        id
    }
}

// 验证表单数据 更新分类
exports.update_cate_schema = {
    body:{
        Id:id,
        name,
        alias,
    }
}
