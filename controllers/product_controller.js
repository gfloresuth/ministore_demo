module.exports.addController = function(app,options){
    var UserModel = options.userModel;
    var ProductModel = options.productModel;
    var SessionOptions = options.sessionOptions;
    app.get('/product_crud/',function(req,res){
        var session_exists = !(typeof req.session == 'undefined');
        if (session_exists==true){
            session_exists=!(typeof req.session.user == 'undefined');
        }
        if (session_exists==false){
            res.render('noaccess.html');
        }else{
            new ProductModel().fetchAll().then(function(products){
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
            new ProductModel().where('id',product_id)
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
};