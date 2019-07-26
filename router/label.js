var express = require('express');

var router = express.Router();
var Message = require('../modules/db/message');
var tools = require('../modules/tools');
router.get('/biaoqian',(req,res)=>{
    
})

// 标签查找
router.get('/label/:id',(req,res)=>{
    
    Message.find({_id:req.params.id})
    .populate('author')
    .exec((err,data)=>{
    var msgs = JSON.parse(JSON.stringify(data));
    res.render('label',{msgs})
    console.log(msgs)
})
})



module.exports = router;