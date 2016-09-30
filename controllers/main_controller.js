module.exports.addController = function(app,options){
    app.get('/',function(req,res){
        var info = {};
        var session_exists = !(typeof req.session == 'undefined');
        if (session_exists==true){
            session_exists=!(typeof req.session.user == 'undefined');
        }
        if (session_exists==false){
            res.render('login.html');
        }else{
            info['user']=req.session.user
            res.render('index.html',info);
        }
    });
};