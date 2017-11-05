/**
 * Created by duhl on 2017/11/4.
 */
const router = require('koa-router')();
const userModel = require('../lib/mysql.js');

// 加密
var md5 = require('md5');


// signUp
router.get('/signup', async (ctx, next) => {
    await ctx.render('signup', {
        session: ctx.session,
    });
});

router.post('/signup', async (ctx, next) => {
    console.log(ctx.request.body);
    const user = {
        name: ctx.request.body.name,
        pass: ctx.request.body.password,
        repeatpass: ctx.request.body.repeatpass
    };
    await userModel.findUserByName(user.name).then(result => {
        console.log(result);

        if (result.length) {
            try {
                throw Error("用户已存在");
            } catch (err) {
                console.error(err)
            }

            ctx.body = {
                code: 1
            }
        } else if (user.pass !== user.repeatpass || user.pass == '') {
            ctx.body = {
                code: 2
            }
        } else {
            ctx.body = {
                code: 3
            };

            console.log("sign success");
            userModel.userSign([user.name, md5(user.pass)])
        }
    }).catch((err) => {
        throw Error(err);
    })
});

module.exports = router;