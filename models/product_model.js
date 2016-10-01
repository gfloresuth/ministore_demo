module.exports = function(bookshelf){
    var model = bookshelf.Model.extend({
        tableName: 'product'
    }); 
    return model;
};