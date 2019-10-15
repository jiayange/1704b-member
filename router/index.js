const router = require('koa-router')()

const query = require('../db/query')

//查询所有成员列表   分页降序
router.get('/api/userlist', async function(ctx) {
    // let data = await query('select * from userlist')
    // ctx.response.body = data

    let { curpage = 1, limit = 2 } = ctx.request.query
    let startIndex = (curpage - 1) * limit

    let data = await query(`select * from userlist order by create_time desc limit ${startIndex},${limit}`)
    let count = await query('select count(*) from userlist')
        // console.log(count)

    let total = Math.ceil(count.data[0]['count(*)'] / limit) //总页数

    if (data.data.length) {
        ctx.body = { code: 1, data: data.data, total }
    } else {
        ctx.body = { code: 0, msg: '暂无数据' }
    }
})

//添加成员信息
router.post('/api/add', async(ctx) => {
    let { name, age, telphone, sex, address, idcard } = ctx.request.body

    if (!name || !age || !telphone || !sex || !address || !idcard) {
        return ctx.body = { code: 2, msg: '参数不完整' }
    }

    //去重,比如身份证号码idcard不能重复添加
    let isHas = await query('select * from userlist where idcard=?', [idcard])
    console.log(isHas) //Promise { <pending> }

    if (isHas.data.length) {
        return ctx.body = { code: 3, msg: '此ID已存在，请重新设置' }
    } else {
        //不存在
        let create_time = new Date()
        let sql = 'insert into userlist (name,age,telphone,sex,address,idcard,create_time) values (?,?,?,?,?,?,?)'

        let res = await query(sql, [name, age, telphone, sex, address, idcard, create_time])
        if (res.msg === 'success') {
            ctx.body = { code: 1, msg: '添加成功' }
        } else {
            ctx.body = { code: 0, msg: '添加失败' }
        }
    }
})

//删除成员信息
router.get('/api/del', async function(ctx) {
    let { id } = ctx.query
    let sql = 'delete from userlist where id=?'
    let res = await query(sql, [id])
    if (res.msg === 'fail') {
        ctx.body = { code: 0, msg: '删除失败' }
    } else {
        ctx.body = { code: 1, msg: '删除成功' }
    }
})

//修改成员信息
router.post('/api/update', async function(ctx) {
    let { name, age, telphone, sex, address, idcard, id } = ctx.request.body
    let sql = 'update userlist u set u.name=?,u.age=?,u.telphone=?,u.sex=?,u.address=?,u.idcard=? where id=?'
    let res = await query(sql, [name, age, telphone, sex, address, idcard, id])
    if (res.msg === 'fail') {
        ctx.body = { code: 0, msg: '修改失败' }
    } else {
        ctx.body = { code: 1, msg: '修改成功' }
    }
})

module.exports = router