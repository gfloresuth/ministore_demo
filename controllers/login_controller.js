module.exports.addController = function(app,options){
    var UserModel = options.userModel;
    var SessionOptions = options.sessionOptions;
    app.get('/login/',function(req,res){
        res.render('login.html');
    });
    app.get('/logout/',function(req,res){
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
            } else {
                res.clearCookie(SessionOptions.name);
                res.redirect('/');
            }
        });
    });
    app.post('/login/',function(req,res){
        var login = req.body.txtUser;
        var pass = req.body.txtPassword;
        /*if (req.body.txtUser==req.body.txtPassword){
            req.session.user = req.body.txtUser;
            res.redirect('/');
        }else{
            res.render('login.html',{'txtUser':req.body.txtUser});
        }*/
        new UserModel().where({'login':login,'pass':pass})
        .fetch()
        .then(function(user){
            if (user ==null){
                res.render('login.html',{'txtUser':login});
            }else{
                var userInfo = user.toJSON();
                req.session.user = login;
                // req.session.name = userInfo.name;


                res.redirect('/');
            }
        }).catch(function(error){
            res.send('Error');
        });
        
    });
}