var _ = require('underscore'),
    io = {},
    uids = {};

exports.setIo = function (ioInstance) {
    _(io).extend(ioInstance);
};

exports.setUsers = function (id) {
    _(uids).extend(id);
};

exports.updateChat = function (data) {
    var socket = this;
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.uid, data);
};

// when the client emits 'adduser', this listens and executes
exports.connect = function (uid) {
    var socket = this;
    // we store the user id in the socket session for this client
    socket.uid = uid;
    // add the client's user id to the global list
    uids[uid] = uid;
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', uid + ' has connected');
    // update the list of uids in chat, client-side
    io.sockets.emit('updateusers', uids);
};

// when the user disconnects perform this
exports.disconnect = function () {
    var socket = this;
    // remove the username from global usernames list
	delete uids[socket.uid];
    // update list of uids in chat, client-side
	io.sockets.emit('updateusers', uids);
	// echo globally that this client has left
	socket.broadcast.emit('updatechat', 'SERVER', socket.uid + ' has disconnected');
};


