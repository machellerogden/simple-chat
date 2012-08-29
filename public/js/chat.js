// socket connection
var socket = io.connect(':3000');

// define models
var uids = $.observableArray(),
    conversation = $.observableArray();

// Wait for DOM...
$.domReady(function () {

    // apply bindings
    $.applyBindings(conversation);

    // socket events
    socket.on('connect', function(){
        socket.emit('connect', prompt('Please enter your name:'));
    });

    socket.on('updatechat', function (uid, data) {
        // set message
        var msg = {
            username: uid
            , message: data
        };
        // add message to conversation model
        conversation.push(msg);
        // scroll to bottom
        var scrollTo = $.doc().height;
        $(window).scrollTop(scrollTo);
        // focus on message input
        $('#msg').focus();
    });

    socket.on('updateusers', function(data) {
        uids.removeAll()
        $.each(data, function(key, value){
            uids.push(key);
        });
    });

    socket.on('error', function(msg) {
        alert(msg);
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
