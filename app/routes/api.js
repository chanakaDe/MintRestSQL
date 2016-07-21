var email = require('../util/email');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

// I have to use mysql connection here too.

function createToken(user) {
    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
    }, secretKey, {
        expirtsInMinute: 1440
    });
    return token;
}
module.exports = function (app, express) {
    var api = express.Router();

    api.post('/signup', function (req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        var toekn = createToken(user);

        //Save query

        email.sendMail(req.body.email);
    });

    api.get('/users', function (req, res) {

    //    View all users

    });

    api.post('/login', function (req, res) {

    //    Login method query.

    });


    return api;
};
