var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var db = require('../util/database');
var pool = db.getPool();

module.exports = function (app, express) {
    var api = express.Router();

    api.get('/income/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from income limit ' + limit + ' offset ' + offset + ' ';

        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
            });
        });
    });

    api.post('/income', function (req, res) {
        var income = {
            id: 0,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            amount: req.body.amount
        };
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO income SET ?', income, function (err, result) {
                res.json({type: "success", code: 200, data: result});
            });
        });

    });

    return api;
};
