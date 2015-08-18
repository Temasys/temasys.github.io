function shareCamera() {
    navigator.getUserMedia({video: true}, function(stream) {
        var v = document.getElementById('screen');
        attachMediaStream(v, stream);
    }, function(error) {

    });
}

function shareScreen() {
    if(location.protocol === 'http:') {
        if(window.confirm('To use screensharing you\'ll have to visit the secure HTTPS version of this site.\nWould you like to go there now?')) {
            location = 'https://' + location.host + location.pathname;
        }
        return;
    }
    navigator.getUserMedia({video: {mediaSource: 'window'}}, function(stream) {
        var v = document.getElementById('screen');
        attachMediaStream(v, stream);
    }, function(error) {

    });
}
