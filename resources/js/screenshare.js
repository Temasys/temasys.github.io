function shareCamera() {
    navigator.getUserMedia({video: true}, function(stream) {
        var v = document.getElementById('screen');
        attachMediaStream(v, stream);
    }, function(error) {

    });
}

function shareScreen() {
    navigator.getUserMedia({video: {mediaSource: 'window'}}, function(stream) {
        var v = document.getElementById('screen');
        attachMediaStream(v, stream);
    }, function(error) {

    });
}
