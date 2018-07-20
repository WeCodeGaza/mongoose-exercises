var mongoose = require('mongoose');

// Connecting to a local database!
mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {
	if (err) throw err;
	console.log('Successfully connected');
});

var authorSchema = mongoose.Schema({
	firstName: String,
	lastName: String
});

