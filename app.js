var express = require('express');

var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

var artTmpEngine = require('./modules/art-tem-config');
artTmpEngine(app);

//导入数据库的表
var User = require('./modules/db/user');
// var Reply = require('./modules/db/reply');
var Message = require('./modules/db/message');
// var tools = require('./modules/tools');
var md5 = require('md5');
var session = require('express-session');
var flash = require('connect-flash');
app.use(flash());
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret:'mylogin',
    resave:true,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:1000*60*60
    },
    store:new MongoStore({
        url:'mongodb://127.0.0.1/myblog'
    })
}));

app.use(function(req,res,next) {
    res.locals.user = req.session.user;
    // res.locals.error = req.flash('error').toString();
    res.locals.success = req.flash('success').toString();
    next();
});

// app.get('/login',(req,res)=>{
//     res.redirect('/')
// })

app.get('/',(req,res)=>{
   
    Message
    .find()
    .populate('author')
    .populate('reples')
    .exec((err,data)=>{ 
        console.log(err);
        console.log(data); 
        var msgs = JSON.parse(JSON.stringify(data));
        var error = req.flash('error').toString();
        console.log(msgs)
        res.render('index',{
            msgs,
            user:req.session.user
        });
        console.log(error);
    
    });

    
});


//存档
app.get('/article',(req,res)=>{
    Message
    .find()
    .exec((err,data)=>{
        var msgs= JSON.parse(JSON.stringify(data)) 
        res.render('article',{msgs})
    })
   
})

 

app.get('/biaoqian',(req,res)=>{
    Message
    .find()
    .exec((err,data)=>{ 
        console.log(err);
        console.log(data); 
        var msgs = JSON.parse(JSON.stringify(data));
        console.log(msgs)
        res.render('biaoqian',{msgs});
    });
})
app.get('/me',(req,res)=>{
    res.render('me')
})




//导入登录路由模块
var loginRouter = require('./router/login');
app.use(loginRouter);


//导入注册路由模块
var registRouter = require('./router/regist');
app.use(registRouter);

//导入发帖路由模块
var blogsRouter = require('./router/blogs');
app.use(blogsRouter);

//导入标签路由模块
var labelRouter = require('./router/label');
app.use(labelRouter);


app.listen(3000,()=>{
    console.log('node running');
});