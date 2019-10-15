const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    //Hash the password 
    getHashedPassword(req) {
        let hashedPass = bcrypt.hashSync(req.body.password, saltRounds);
        return hashedPass;
    },
    //compare and verify the password entered to the passord in data base for the same username
    checkPassword(passwordToCheck, hashedPassword) {
        return bcrypt.compareSync(passwordToCheck, hashedPassword);
    }
}