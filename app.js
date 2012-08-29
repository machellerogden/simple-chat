/*
 * MODULES
 */

// framework modules
var express = require('express')
    , http = require('http')
    , stylus = require('stylus')
    , nib = require('nib');


/*
 * CONFIG
 */

// create app server
var app = module.exports = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
}

// app server config
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine','jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({
        src: __dirname + '/views' 
        , dest: __dirname + '/public' 
        , compile: compile
    }));
    app.use(express.static( __dirname + '/public' ));
    app.use(app.router);
});

// development
app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true }));
});

// production
app.configure('production', function () {
    app.use(express.errorHandler());
});


/*
 * START
 */

// attach socket.io to app server
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// listen on port 3000
server.listen(3000);


/*
 * INIT
 */

// application modules
var chat = require('./utils/chat')
    , routes = require('./routes');

// set io
chat.setIo(io);

// set chat uids
var uids = {};
chat.setUsers(uids);


/*
 * ROUTES
 */

// cors
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type');
    res.header('Access-Control-Request-Method','GET,POST');
    next();
});

// simple socket.io chat route
app.get('/chat', routes.chat.render);

// everything else
app.get('*', function (req, res) {
    res.send('what??',404);
});


/*
 * SOCKETS
 */

io.sockets.on('connection', function (socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', chat.updateChat);

	// when the client emits 'connect', this listens and executes
	socket.on('connect', chat.connect);

	// when the user disconnects.. perform this
	socket.on('disconnect', chat.disconnect);

});

