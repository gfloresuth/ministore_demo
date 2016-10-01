module.exports = function(bookshelf){
    var model = bookshelf.Model.extend({
        tableName: 'user'
    }); 
    return model;
};