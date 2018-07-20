var mongoose = require('mongoose');

// Connecting to a local database!
mongoose.connect('mongodb://localhost/mongoose_basics_1', function (err) {
	if (err) throw err;
	console.log('Successfully connected');
});

var authorSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	fullName: {
		firstName: String,
		lastName: String		
	},
	biography: String,
	twitter: {
		type: String,
		// special type for validating our input data
		validate: {
			validator: function(text) {
				// make sure text begins with 'http://www.twitter.com'
				// or 'www.twitter.com'
				return (text.indexOf('http://www.twitter.com') === 0 
					|| text.indexOf('www.twitter.com') === 0
					|| text.indexOf('https://www.twitter.com') === 0)
			}
		}
	},
	// twitter: String,
	facebook: String,
	instagram: String,
	profilePicture: Buffer,
	// the time when we created this entry
	created: {
		type: Date,
		default: Date.now
	},
});

// book: summary

var bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
		type: String,
		unique: true,
	},
	summary: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author'
	},
	ratings: [
	{
		summary: String,
		// set a  maximum and a minimum
		numberOfStars: {
			type: Number, 
			min: 0, 
			max: 5
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	published: Date,
	picture: Buffer,
	created: {
		type: Date,
		default: Date.now
	}
});

var Author = mongoose.model('Author', authorSchema);
var Book = mongoose.model('Book', bookSchema);

var jkRowling = new Author({
	_id: new mongoose.Types.ObjectId(),
	fullName: {
		firstName: 'J. K.',
		lastName: 'Rowling'
	},
	biography: 'J.K. Rowling is the author of the AMAZING harry potter series',
	twitter: 'https://www.twitter.com/jkrowling'
	// facebook, instagram, profile picture are not set!
});

jkRowling.save(function(err) {
	if (err) throw err;

	// if no error
	console.log('Author successfully saved!');
	console.log('ID' + jkRowling._id);

	var harryPotter1 = new Book({
		_id: new mongoose.Types.ObjectId(),
		title: 'Harry Potter and the Deathly Hallows',
		author: jkRowling._id,
		ratings: [{
			numberOfStars: 4.5
		}, {
			numberOfStars: 5,
			summary: 'This was great!'
		}]
	});
	harryPotter1.save(function(err) {
		if (err) {
			console.log('This book is a duplicate!');
		}

		console.log('Book successfully saved!!!');
		console.log('yaaaaaaaaay');
	});

	var harryPotter2 = new Book({
		_id: new mongoose.Types.ObjectId(),
		author: jkRowling._id,
		title: 'Harry Potter and the Chamber of Secrets',
		ratings: [{
			summary: 'I really enjoyed this book',
			numberOfStars: 5
		}, {
			summary: 'It was just OK',
			numberOfStars: 3
		}, {
			summary: 'Best book ever!!!!!',
			numberOfStars: 5
		}]
	});
	harryPotter2.save(function(err) {
		if (err) {
			console.log('This book is a duplicate!');
		}
		console.log('Book successfully saved!');
	})
});

var johnGreen = new Author({
	_id: new mongoose.Types.ObjectId(),
	fullName: {
		firstName: 'John',
		lastName: 'Green'
	},
	biography: 'John Green is the author of Paper Towns and many other great books',
	twitter: 'https://www.twitter.com/johngreen'
});

johnGreen.save(function(err) {
	if (err) throw err;

	console.log('Author successfully saved!');
	var paperTowns = new Book({
		_id: new mongoose.Types.ObjectId(),
		author: johnGreen._id,
		title: 'Paper Towns',
		ratings: [{
			summary: 'I really enjoyed this book',
			numberOfStars: 5
		}]
	});

	paperTowns.save(function(err) {
		if(err) {
			console.log('This book is a duplicate!');
		}
		console.log('Book successfully saved!');
	})
});

// Let's write a search query!
Book.find({
	title: /Harry Potter/i
}).exec(function(err, books) {
	if (err) throw err;
	// TODO: calculate and print the average rating for each book!
	console.log(books);
});
