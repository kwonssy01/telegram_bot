module.exports = function() { 
	this.connection = require('mysql').createConnection({
                host : "www.sample.com",
                port : 3306,
                user : "master",
                password : "password",
                database : "database"
	});
};