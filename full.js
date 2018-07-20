var mongoose = require('mongoose');

// Connecting to a local database!
mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {
	if (err) throw err;
	console.log('Successfully connected');
});

// define the name type + created at
var authorSchema = mongoose.Schema({
	name: {
		firstName: String,
		lastName: String
	},
	created: Date
});

// let's make two schemas that are related to one another!
var authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
  	firstName: String,
  	lastName: String
  },
  biography: String,
  twitter: String,
  facebook: String,
  instagram: String,
  profilePicture: Buffer,
  created: { 
    type: Date,
    default: Date.now
  }
});

// next, a book schema
var bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  summary: String,
  isbn: String,
  thumbnail: Buffer,
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Author'
  },
  ratings: [
    {
      summary: String,
      detail: String,
      numberOfStars: Number,
      created: { 
        type: Date,
        default: Date.now
      }
    }
  ],
  created: { 
    type: Date,
    default: Date.now
  }
});

// Now, we can create models from these schemas
// The schema describes what should be in a model, and the model 
// can be an instance of that data.
var Author = mongoose.model('Author', authorSchema);
var Book = mongoose.model('Book', bookSchema);

// Let's create some instances of this data! 
// First, we can make an author
var jkRowling = new Author({
  _id: new mongoose.Types.ObjectId(),
  name: {
    firstName: 'J. K.',
    lastName: 'Rowling'
  },
  biography: 'J.K. Rowling is the author of the popular Harry Potter series.',
  twitter: 'https://twitter.com/jkrowling'
});
 
// Now, we save this author to our database, along with two books
// she has written.
jkRowling.save(function(err) {
    if (err) throw err;
     
    console.log('Author successfully saved.');
    console.log('ID' + jkRowling._id);

    var harryPotter1 = new Book({
    	_id: new mongoose.Types.ObjectId(),
    	title: 'Harry Potter and the Sorceror\'s Stone',
    	author: jkRowling._id,
    	ratings:[{
    		summary: 'This is my favorite book!'
    	}]
    });
    harryPotter1.save(function(err) {
    	if (err) throw err;

    	console.log('Book successfully saved');
    });

    var harryPotter2 = new Book({
    	_id: new mongoose.Types.ObjectId(),
    	title: 'Harry Potter and the Chamber of Secrets',
    	author: jkRowling._id,
    	ratings:[{
    		summary: 'Not as good as the first one :/'
    	}]
    });
    harryPotter2.save(function(err) {
    	if (err) throw err;

    	console.log('Book successfully saved.');
    });
});

// next step: introduce a validator
// in schema, we add
// var authorSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   name: {
//   	firstName: String,
//   	lastName: String
//   },
//   biography: String,
//   // ADD HERE
//   twitter: {
//   	type: String,
//   	validate: {
//       validator: function(text) {
//         return text.indexOf('https://twitter.com/') === 0;
//       },
//       message: 'Twitter handle must start with https://twitter.com/'
//     }
//   },
//   // add validator
//   facebook: String,
//   // add validator
//   instagram: String,
//   profilePicture: Buffer,
//   created: { 
//     type: Date,
//     default: Date.now
//   }
// });

// Now, let's figure out how we search for data!
Book.find({
	title: /Harry Potter/i
}).exec(function(err, books) {
	if (err) throw err;

	console.log(books);
});

// Let's limit to the first five books, and in 
// descending order by date created
Book.find({
	title: /Harry Potter/i
}).sort('-created')
.limit(5)
.exec(function(err, books) {
	if (err) throw err;
	 
	console.log(books);
});

// Set this based on previous console output
var jkRowlingID = '5b51c1e24c29d4200c0c9e39';

// Find the author by ID
// the ID may be different
Author.findById(jkRowlingID, function(err, author) {
	if (err) throw err;
	console.log(author);
});

// When you find something, you can then modify it inside the same callback
Author.findById(jkRowlingID, '59b31406beefa1082819e72f', function(err, author) {
  if (err) throw err;
  author.instagram = 'https://www.instagram.com/jkrowling';
   
  author.save(function(err) {
    if (err) throw err;   
    console.log('Author updated successfully');
  });
});

// This is actually it's own function in Mongoose!
Author.findByIdAndUpdate(jkRowlingID, 
  { 
  	instagram: 'http://www.instagram.com/jkworling'
  },
  function(err, author) {
  	if (err) throw err;
  	console.log('Author updated successfully');
  }
);




