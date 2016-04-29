module.exports = function() { 
	this.connection = require('mysql').createConnection({
                host : "example.com",
                port : 3306,
                user : "master",
                password : "password",
                database : "database"
	});
};
