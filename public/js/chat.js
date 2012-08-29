// socket connection
var socket = io.connect('http://localhost:3000');

// define models
var uids = $.observableArray(),
    conversation = $.observableArray();

// Wait for DOM...
$.domReady(function () {

    // apply bindings
    $.applyBindings(conversation);

    // socket events
    socket.on('connect', function(){
        socket.emit('connect', prompt("What's your name?"));
    });

    socket.on('updatechat', function (uid, data) {
        // set message
        var msg = {
            username: uid
            , message: data
        };
        // add message to conversation model
        conversation.push(msg);
        // return focus to send button
        $('#send').focus();
    });

    socket.on('updateusers', function(data) {
        uids.removeAll()
        $.each(data, function(key, value){
            uids.push(key);
        });
    });

    // ui events
    $('#send').click( function() {
        var msg = $('#msg').val()
        $('#msg').val('');
        socket.emit('sendchat', msg);
    });

    $('#msg').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#send').focus().click();
        }
    });

});
