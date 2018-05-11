const express = require('express');
const morgan = require('morgan'); // For logging request details of whatever requests user has made to the server. Basically a logger, on any requests being made,it generates logs automatically. If the request is get then it will show get/ and then whatever URL the user is targetting at
const bodyParser = require('body-parser'); // To read data from front-end input text-field.
const mongoose = require('mongoose'); //
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const config = require('./config/secret');

const app = express(); // creating an instance of express library

const http = require('http').Server(app);
const io = require('socket.io')(http);

const sessionStore = new MongoStore({})

mongoose.connect(config.database, function(err) {
    if(err) console.log(err);
    console.log("Connected to database");
})

// Set up which template engine will be used in this app with app.engine
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}))

app.set('view engine', 'hbs'); // Sets up the 'view engine' value to be 'hbs'. In other words, sets the variable 'view engine' to the value 'hbs' and later I can call this variable with app.get('view engine').

// The next set of functions call app.use() to add the middleware libraries into the request handling chain. In addition to the 3rd party libraries I imported previously, I use the express.static middleware to get Express to serve all the static files in the /public directory in the project root.

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
/* Create a new morgan logger middleware function using the given format and options. Concise output colored by response status for development use.

However, looking at the Morgan documentation (https://www.npmjs.com/package/morgan) I see many useful pre-defined formats. The combined setting is very useful for logging production bugs - it provides user agent info. So, I could change my above middleware declaration as below.

if (app.get('env') === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

*/

