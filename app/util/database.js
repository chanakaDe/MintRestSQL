
// This is the centralized connection class.. Like singleton pattern.

var mysql = require('mysql');

module.exports = {
    makeConnection: function () {

      mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'chanaka',
        database : 'shared_adult'
      });
    }
};
