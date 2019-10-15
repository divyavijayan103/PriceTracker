const User = require('../models').users;
const { getHashedPassword, checkPassword } = require('./bcrypt_controller');

module.exports = {
    //Inserts the user details into database
    create(req, res) {
        //Check if username already exists
        User.findOne({ where: { username: req.body.username.toLowerCase() } })
            .then(user => {
                //If username doesnot exist, insert user details into database
                if (!user) {
                    return User
                        .create({
                            username: req.body.username.toLowerCase(),
                            password: getHashedPassword(req),
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                        })
                        .then((user) => {
                            //generate the jwt token and send in response
                            //let tokenVal = token.createToken({ username: req.body.username.toLowerCase() })
                            res.status(200).send({
                                'success': true,
                                'message': 'Registered successfully',
                                //'data': {
                                    //'token': tokenVal
                                //}
                            })
                        })
                        .catch((error) => res.status(500).send({
                            'success': false,
                            'message': 'Cannot create user profile'
                        }));
                }
                //if username already exist
                else {
                    return res.status(409).send({
                        'success': false,
                        'message': 'Username already exists'
                    })
                }
            })
    },
    //Login validation
    login(req, res) {
        //check if username is valid
        return User.findOne({ where: { username: req.body.username.toLowerCase() } })
            .then((user) => {
                if (user) {
                    //Check if password is valid
                    let status = checkPassword(req.body.password, user.dataValues.password);
                    if (status) {
                        //generate the jwt token and send in response
                        //let tokenVal = token.createToken({ username: req.body.username.toLowerCase() })
                        res.status(200).send({
                            'success': true,
                            'message': 'Successfully logged in',
                            //'data': {
                                //'token': tokenVal
                            //}
                        })
                    } else {
                        res.status(401).send({
                            'success': false,
                            'message': 'Invalid username or password'
                        })
                    }
                }
                else {
                    res.status(401).send({
                        'success': false,
                        'message': 'Invalid username or password'
                    })
                }
            })
    },
};