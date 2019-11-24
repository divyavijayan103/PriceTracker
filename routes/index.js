const userController = require('../controllers').user;
const searchController= require('../controllers').search;
module.exports = function(app){
    app.post('/pricetracker/register', userController.create);
    app.post('/pricetracker/login', userController.login);
    app.get('/pricetracker/search',searchController.search);
    app.put('/pricetracker/addToWatchList',searchController.addToWatchList);

}