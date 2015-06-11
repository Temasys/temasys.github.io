---
layout: post
title: Screensharing with SkylinkJS
category: How-To
author: Thomas Gorissen

excerpt: SkylinkJS makes sharing your screen with others incredibly easy to implement for web developers. Upgrade your conferencing or co-working app and enable your users to benefit from easy sharing of their work or application in all major browsers.

---

[SkylinkJS](http://skylink.io/web) makes sharing your screen with others during a WebRTC conference or call incredibly easy to implement for web developers. Here is a little demo.

<button onclick="shareCamera()">Get your camera video</button><button onclick="shareScreen()">Share your screen</button><br/>
<i style="font-size: 0.8em">Works in Chrome 34+, Firefox 33+ and with a commercial version of our [Temasys WebRTC Plugin](http://skylink.io/plugin) in IE10+ and Safari 7.1+</i>
<div style="border: 1px solid #ddd; background: -webkit-radial-gradient(200px 100px, #fff, #f2f2f2);
}"><video id="screen" width="100%" autoplay muted></video></div>
<script src="//cdn.temasys.com.sg/adapterjs/0.11.x/adapter.screenshare.js"></script>
<script async src="/resources/js/screenshare.js" defer></script>


Let's run through and build a simple conferencing website to show how easy it is. [Run the demo](https://codepen.io/serrynaimo/debug/bdRWNR) in two of your browser tabs to send a receive the screen.


### Step 1: Include SkylinkJS into your website

{% highlight html %}
<html>
<head>
  <title>WebRTC screensharing with SkylinkJS</title>

  <script src="//cdn.temasys.com.sg/skylink/skylinkjs/0.6.x/skylink.complete.js"></script>
</head>
<body>

  <button onclick="start()">Share screen</button><br/>
  <video id="myscreen" autoplay muted></video>

</body>
</html>
{% endhighlight %}

We're reusing a slightly modified version of our earlier Getting Started tutorial to show you how to get it to share your desktop. In case you want to understand it fully, find [this previous article here](/how-to/2014/08/08/Getting_started_with_WebRTC_and_SkylinkJS/).


### Step 2: Instantiate Skylink and subscribe events, initialize

{% highlight javascript %}
var skylink = new Skylink();
{% endhighlight %}
As in the tutorial before, create a new Skylink object and subscribe the necessary events using the *on()* function. Then introduce yourself to Skylink with your App key and pick the room ID of your call or conferencing session.

{% highlight javascript %}
skylink.on('peerJoined', function(peerId, peerInfo, isSelf) {
  if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
  var vid = document.createElement('video');
  vid.autoplay = true;
  vid.muted = true; // Added to avoid feedback when testing locally
  vid.id = peerId;
  document.body.appendChild(vid);
});

skylink.on('incomingStream', function(peerId, stream, isSelf) {
  if(isSelf) return;
  var vid = document.getElementById(peerId);
  attachMediaStream(vid, stream);
});

skylink.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var vid = document.getElementById(peerId);
  document.body.removeChild(vid);
});

skylink.on('mediaAccessSuccess', function(stream) {
  var vid = document.getElementById('myscreen');
  attachMediaStream(vid, stream);
});

skylink.init({
  apiKey: 'Your App key',
  defaultRoom: 'Pick a room name'
});
{% endhighlight %}


### Step 3: Share your screen

{% highlight javascript %}
function start() {
  skylink.shareScreen();
  skylink.joinRoom();
}
{% endhighlight %}
*[shareScreen](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#method_shareScreen)* Is the one simple function that will start the process to ask the user which window he wants to share. In this case we call it before we join the room, but it is possible to call it at anytime during the session and it will replace an existing camera stream with the video of your shared window while maintaining the audio.

It uses our [AdapterJS](http://github.com/Temasys/AdapterJS) shim to guide the user through the required process of installing whatever extension, plugin or addon is required for his specific browser to enable access to his desktop. In case a user does not have the required extension, he'll see a bar like the one below to walk him through the installation process. He'll have to refresh the page once, but not the entire browser.

<img src="/resources/img/chromescreensharing.png" style="width: 100%; border: 1px solid #aaa;" />

** Please note: The screensharing feature requires your website to run on HTTPS! **


Play around with it and leave us your feedback in our [developer chat](http://livesupport.temasys.com.sg/)! We'd love to hear from you.
If you don't have one yet, you can register and get your own App key using our [Developer Console]([Temasys Developer Console](https://developer.temasys.com.sg).


## Resources

- [Temasys Developer Console](https://developer.temasys.com.sg) - Get your App key
- [Skylink API Documentation](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html)
- [SkylinkJS version history](https://github.com/Temasys/SkylinkJS/releases)
- [SkylinkJS source-code on Github](http://github.com/Temasys/SkylinkJS)
- [How to get support or contribute](https://developer.temasys.com.sg/support)


