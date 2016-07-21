var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var db = require('../util/database');
var mysql = require('mysql');

connection = mysql.createConnection({    // Cannot use connection like that all the files.
    host: 'localhost',                       // Have to take it from a connection pool with singleton.
    user: 'root',
    password: 'chanaka',
    database: 'demo_db'
});

connection.connect();


module.exports = function (app, express) {
    var api = express.Router();

    api.get('/income/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from tblvideo limit ' + limit + ' offset ' + offset + ' ';


        // I tried like this. But not working. :(

        //db.makeConnection.getConnection(function (err, connection) {
        //    connection.query(query, function (err, rows, fields) {
        //        if (err) throw err;
        //        res.json({type: "success", code: 200, data: rows});
        //    });
        //});

        connection.query(query, function (err, rows, fields) {
            if (err) throw err;
            res.json({type: "success", code: 200, data: rows});
        });


    });

    /**
     * Returning the API.
     */
    return api;
};
