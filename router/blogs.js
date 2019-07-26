var express = require('express');

var router = express.Router();
var Message = require('../modules/db/message');
var tools = require('../modules/tools');
var Reply = require('../modules/db/reply');
router.use(express.urlencoded({extended:false}));

router.get('/blogs',(req,res)=>{
    var error = req.flash('error').toString();
    res.render('blogs',{error})
})

router.post('/blogs',(req,res)=>{
    if (!req.session.user) {
        req.flash('error','请登录');
        res.redirect('/blogs');
        return;
    }
    else{
       var msg = new Message({
        title:req.body.title,
        label:req.body.label,
        content:req.body.content,
        time: tools.dateFormat(new Date()),
        year:tools.yearFormat(new Date()),
        author:req.session.user._id,
        reples:[]
        });
    
    msg.save(err=>{
        res.redirect('/')
        console.log(msg)
    });
} 
});

//博客详情页
router.get('/detail/:id',(req,res)=>{
    Message
    .findOne({_id:req.params.id})
    .populate('author')
    .populate('reples')
    .exec((err,data)=>{
        if (err) return console.log(err.message)
        var msgs = JSON.parse(JSON.stringify(data));
            res.render('detail',{
                msgs
            });
    });
})


//回复 
router.post('/reply/:id',(req,res)=>{
    var reply = new Reply({
        content:req.body.content,
        time: tools.dateFormat(new Date()) ,
        username:req.session.user.username
    });
    reply.save(()=>{
        Message.findOne({_id:req.params.id},(err,data)=>{
            if (err) return console.log(err.message)
            data.reples.push(reply.id);
            data.save(()=>{
                res.redirect('/detail/' + req.params.id)
                // console.log(data)
            });
        });
    });
});


//编辑
router.get('/bianji/:id',(req,res)=>{
    Message.findOne({_id:req.params.id},(err,data)=>{
        console.log(req.params.id);
        res.render('bianji',{
            data: JSON.parse(JSON.stringify(data)),
			user: req.session.user
        });
        
    });
})
router.post('/bianji/:id',(req,res)=>{
    console.log(req.body.title);
    Message.updateOne({_id:req.params.id},{
        content:req.body.content,
        time: tools.dateFormat(new Date()),
        author:req.session.user._id,
        reples:[]
    },err=>{
        res.redirect('/');
    });
});

//删除
router.get('/delete/:id',(req,res)=>{

    Message.findByIdAndDelete({_id:req.params.id},err=>{
        if (err) {
            res.send('删除失败');
        } else {
            res.redirect('/');
        }
    });
});

//作者博客页
router.get('/people/:id',(req,res)=>{
    Message
    .find({author:req.params.id})
    .populate('author')
    .exec((err,data)=>{
        var msgs = JSON.parse(JSON.stringify(data));
          res.render('people',{msgs})
    
    })      
    });



// 搜索框搜索
router.get('/search', (req, res) => {
    Message.find({
        $or: [
            { title: { $regex: req.query.search,$options:'$i' } }, 
            { label: { $regex: req.query.search,$options:'$i' } },
            { content: { $regex: req.query.search,$options:'$i' } }
        ]
    }).exec((err, msgs) => {
        res.render('search', { msgs })
        console.log(msgs)
    })

})





module.exports = router;