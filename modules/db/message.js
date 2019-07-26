var mongoose = require('./connection');

var msgSchema = new mongoose.Schema({
    title:String,
    label:[],
    content:String,
    time:String,
    year:String,
    author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
    reples:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'reply'
                }
            ]
});

var Message = mongoose.model('message',msgSchema);

module.exports = Message;