/**
 * Created by chanaka on 7/22/16.
 */
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;
var db = require('../util/database');
var pool = db.getPool();

module.exports = function (app, express) {
    var api = express.Router();

    api.use(function (req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({type: "failed", code: 403, data: false, message: "FAILED_TO_AUTHENTICATE"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({type: "failed", code: 403, data: false, message: "NO_VALID_TOKEN_PROVIDED"});
        }
    });

    api.get('/income/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from income limit ' + limit + ' offset ' + offset + ' ';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
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
                connection.release();
            });
        });
    });

    api.put('/income', function (req, res) {

        var income = {
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            amount: req.body.amount
        };
        pool.getConnection(function (err, connection) {
            connection.query('UPDATE income SET title = ?,description = ?,date = ?,amount = ? WHERE id = ?',
                [income.title, income.description, income.date, income.amount, income.id], function (err, result) {
                    res.json({type: "success", code: 200, data: result});
                    connection.release();
                });
        });
    });

    api.get('/income_chart', function (req, res) {

        var query = "SELECT 'January' AS mName, 1 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 1" +
            " UNION" +
            " SELECT 'February' AS mName, 2 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 2" +
            " UNION" +
            " SELECT 'March' AS mName, 3 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 3" +
            " UNION" +
            " SELECT 'April' AS mName, 4 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 4" +
            " UNION" +
            " SELECT 'May' AS mName, 5 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 5" +
            " UNION" +
            " SELECT 'June' AS mName, 6 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 6" +
            " UNION" +
            " SELECT 'July' AS mName, 7 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 7" +
            " UNION" +
            " SELECT 'August' AS mName, 8 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 8" +
            " UNION" +
            " SELECT 'September' AS mName, 9 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 9" +
            " UNION" +
            " SELECT 'October' AS mName, 10 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 10" +
            " UNION" +
            " SELECT 'November' AS mName, 11 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 11" +
            " UNION" +
            " SELECT 'December' AS mName, 12 AS mOrder, COALESCE(SUM(amount),0) AS total_num" +
            " FROM income i" +
            " WHERE month(i.date) = 12";
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    return api;
};
