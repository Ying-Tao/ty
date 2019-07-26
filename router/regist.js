//注册模块


var express = require('express');

var router = express.Router();

var User = require('../modules/db/user');

var md5 = require('md5');


router.get('/regist',(req,res)=>{
    var error = req.flash('error').toString();
    res.render('regist',{error})
})
router.post('/regist',(req,res)=>{
    User.findOne({username:req.body.username},(err,data)=>{
        if (data) {
            req.flash('error','用户名已被注册过啦');
            res.redirect('/regist');
        } else {
            if(req.body.password != req.body.repassword){
                req.flash('error','两次密码不一致');
                res.redirect('/regist');
            } else{
                req.body.password = md5(req.body.password);
                req.body.repassword = md5(req.body.repassword);
                var u = new User(req.body);
                u.save(err=>{
                    res.redirect('/login');
                });
            }
            
        }
    })
})
module.exports = router;