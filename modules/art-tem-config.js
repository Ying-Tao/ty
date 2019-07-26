var artTem = require('art-template');
var artTemRenderEngine = require('express-art-template');
artTem.defaults.root = './views';
artTem.defaults.extname = '.html';
function artTemEngine(app){
    
    app.engine('html',artTemRenderEngine);
    app.set('view engine','html');
}

module.exports = artTemEngine;