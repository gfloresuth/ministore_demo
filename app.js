var express=require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise  = require('bluebird');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const PORT = 3000;

var dbConfig={
	client:'mysql',
    connection:{
	 host:'localhost',
	 user:'root',
	 password:'usbw',
	 database:'ministore',
	 charset:'utf8'
  }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);

var allowCrossDomain=function(req,res,next){
        res.header('Access-Control-Allow-Origin','*');
        next();
};

app.use(allowCrossDomain);
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

var bookshelf = app.get('bookshelf');

var Product=bookshelf.Model.extend({
	tableName:'product'
});
var User=bookshelf.Model.extend({
	tableName:'user'
});
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.engine('html', require('atpl').__express);
// se especifica que el 'view engine' es 'html' (declarado previamente)
app.set('view engine','html');

app.set('devel',false)

var session_options={
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave:true,
  store: new FileStore()

}

app.use(session(session_options));
app.get('/login/',function(req,res){
        res.render('login.html');
});

app.get('/',function(req,res){
    var info = {};
    if (typeof req.session.user == 'undefined'){
        res.render('login.html');
    }else{
        info['user']=req.session.user
        res.render('index.html',info);
    }
});
app.get('/logout/',function(req,res){
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie(session_options.name);
            res.redirect('/');
        }
    });
});

app.get('/product_crud/',function(req,res){
    var session_exists = !(typeof req.session == 'undefined');
    if (session_exists==true){
        session_exists=!(typeof req.session.user == 'undefined');
    }
    if (session_exists==false){
        res.render('noaccess.html');
    }else{
        new Product().fetchAll().then(function(products){
            var info={
                'status':'ok',
                'message':'ok',
                'user' : req.session.user,
                'products' : products.toJSON()
            };
            res.render('product_crud_list',info)

        }).catch(function(error){
            var info={
                'status':'error',
                'message':'Error when listing ' + error,
                'user' : req.session.user
               
            }
            res.render('product_crud_list',info);
        });
    }
});
app.get('/product_crud/edit/:id',function(req,res){
    var session_exists = !(typeof req.session == 'undefined');
    if (session_exists==true){
        session_exists=!(typeof req.session.user == 'undefined');
    }

    if (session_exists==false){
        res.render('noaccess.html');
    }else{
        var product_id=req.params.id;
        new Product().where('id',product_id)
        .fetch()
        .then(function(product){
            var info={
                'status':'ok',
                'message':'ok',
                'user' : req.session.user,
                'product' : product.toJSON()
            };
            res.render('product_crud_edit',info)
            
        }).catch(function(error){

        });
    }
});

app.post('/login/',function(req,res){
    console.log(req.body);
    console.log(req.session);
    if (req.body.txtUser==req.body.txtPassword){
        req.session.user = req.body.txtUser;
        res.redirect('/');
        //res.render('index.html');
    }else{
        res.render('login.html',{'txtUser':req.body.txtUser});
    }
});


app.listen(PORT, function(){
    console.log('Ready http://localhost:'+PORT+'/');
});