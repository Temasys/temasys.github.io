var skylink = new Skylink();

skylink.setLogLevel(skylink.LOG_LEVEL.DEBUG);

skylink.on("mediaAccessSuccess", function(stream) {

    var v = document.getElementById('screen');
    attachMediaStream(v, stream);

});

