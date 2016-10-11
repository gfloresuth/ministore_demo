var express=require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise  = require('bluebird');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const PORT = 3000;

var dbConfig=require('./config/db_config.js');
console.log(dbConfig);

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);

var allowCrossDomain=function(req,res,next){
        res.header('Access-Control-Allow-Origin','*');
        next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/assets/',express.static(__dirname+"/public"));

// bookshelf
var bookshelf = app.get('bookshelf');

// Load modules
var User_Model = require('./models/user_model.js');
var Product_Model = require('./models/product_model.js');

var User = new User_Model(bookshelf);
var Product = new Product_Model(bookshelf);
console.log(Product);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.engine('html', require('atpl').__express);
app.set('view engine','html');
app.set('devel',false)

var session_options={
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave:true,
  store: new FileStore()
};

app.use(session(session_options));

var login_controller = require('./controllers/login_controller.js');
var product_controller = require('./controllers/product_controller.js');
var main_controller = require('./controllers/main_controller.js');

login_controller.addController(app,{userModel:User,sessionOptions:session_options});
product_controller.addController(app,{userModel:User,productModel:Product,sessionOptions:session_options});
main_controller.addController(app,{userModel:User,sessionOptions:session_options});

app.listen(PORT, function(){
    console.log('Ready http://localhost:'+PORT+'/');
});