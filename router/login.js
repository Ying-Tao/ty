//登录模块
var express = require('express');

var router = express.Router();

var User = require('../modules/db/user');

var md5 = require('md5');
//登录
router.get('/login',(req,res)=>{
    var error = req.flash('error').toString();
    res.render('login',{error})
})
router.post('/login',(req,res)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if (!user) {
            req.flash('error','用户名不存在');
            res.redirect('/login');
        } else {
            if (md5(req.body.password) == user.password) {
                req.session.user = user;
                res.render('index',{user});
    
            } else {
                req.flash('error','密码错误');
                res.redirect('/login');
            }
        }
    });
    
});

// 退出登录
router.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/');
});



module.exports = router;