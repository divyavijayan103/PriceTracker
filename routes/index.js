const userController = require('../controllers').user;

module.exports = function(app){
    app.post('/pricetracker/register', userController.create);
    app.post('/pricetracker/login', userController.login);
}