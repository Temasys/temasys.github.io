---
layout: post
title: Getting started with WebRTC and SkywayJS
category: How-To
author: Thomas Gorissen

excerpt: Building a simple audio/video conferencing website that doesn't need any server-side code and works with up to 8-10 peers on a modern computer and even up to 4 people on recent Android phones.

---

You may have heard of WebRTC and its magical abilities recently and, like many, you might have found yourself struggling with trying to get even a simple demo going. The team here at Temasys built SkywayJS to address this and make it easy to build reliable peer connectivity solutions on any website with the help of WebRTC.

Here is an example codepen that we've created that shows how you can create a very simple audio/video conference with merely 35 lines of JavaScript client-side code, with no additional server-code required.

<p data-height="370" data-theme-id="7751" data-slug-hash="nKvBu" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/serrynaimo/pen/nKvBu/'>WebRTC with SkywayJS</a> by Thomas Gorissen (<a href='http://codepen.io/serrynaimo'>@serrynaimo</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

To further demonstrate the possibilities and flexibility of SkywayJS, I've also created a more elaborate demo created with the help of [Facebooks React](http://facebook.github.io/react/) at [http://getaroom.io](http://getaroom.io). Check it out, share it, and and use it if you like it.




## How does this work?

### Skyway: IaaS for multi-media peer connectivity

Temsys has created the super scalable Skyway infrastructure that helps to connect two or more peers very reliably and easily. It was designed specifically for [WebRTC](http://en.wikipedia.org/wiki/WebRTC), which enables your browser to send data directly to another browser. That data can be a chat message, a file or even an audio/video stream from your devices camera and microphone thus allowing you to create all kinds of cool real-time video conferencing, collaboration, tutoring and other live-presence use-cases.

### The SkywayJS library

WebRTC is still a rather low-level browser API and requires you to do significant work around solving signaling issues and resolving differences in implementation between web browsers. We at Temasys are part of the [WebRTC working group at the W3C](http://www.w3.org/2011/04/webrtc-charter.html) and create solutions with and around WebRTC for more than a year now. We know this part of the puzzle inside and out, and that is why we have created SkywayJS. We want to solve the connectivity and implementation headaches for you and let you focus on building the cool stuff.

### API keys, alias keys, realms, rooms and peers

When you use SkywayJS in your website or app, you can invite users (we call them "peers") to join a shared space in which they can exchange data privately with each other. We call this space a "room". Every peer that wants to join a room needs to know its unique identifier, like a secure, generated token or a simple name. We leave it up to you on how you come up with these room IDs and how you inform peers about them. One of our primary goals in SkywayJS was to not interfere with your application logic or UX. We recommend generating [UUIDs](http://jsfiddle.net/briguy37/2MVFd/) as a best-practice here for making the identifiers difficult to guess, reasonably unique and providing an additional layer of privacy of your users during room sessions.

You identify yourself to the Skyway Infrastructure with your unique "API key" that you can create in our [Developer Console](https://developer.temasys.com.sg) or via our REST API. Every API key creates a new "realm" in which your rooms can exist. Every API key will only work on your specified [CORS domain name](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing). If you want to have a different website or app access the same realm and therefor the same rooms, you are also able to create "alias keys" that extend the scope of the realm to other domains or simply isolate your apps various flavors for logging and reporting purposes.


### Compatibility and Performance

Only Google Chrome and Mozilla Firefox support the technology natively in their current versions. We thought that wasn't good enough and therefor created plugins for Mac and Windows to upgrade Safari and Internet Explorer to support the current WebRTC standard as well. [They're available for free download here.](https://www.google.com.sg/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CBsQFjAA&url=https%3A%2F%2Ftemasys.atlassian.net%2Fwiki%2Fdisplay%2FTWPP%2FWebRTC%2BPlugins&ei=S3LsU6HHHtbj8AXCtYLoCg&usg=AFQjCNGXt5FJ1mNT2bS91Sq00ReyUoXUKQ&sig2=rmls5vwC3S2rM5SzlkcaDQ&bvm=bv.73231344,d.dGc)

It's still early days for WebRTC, but assuming a modern multi-core processor and broadband internet connection you can reasonably expect to achieve 8-10 peers in an audio/video conference.

Chrome for Android supports WebRTC as well, but however due to the less powerful CPUs found in the many mobile devices an expectation of three peers is more likely with more possible on latest devices with hardware VP8 acceleration. Users on iOS and other mobile OS will still have to wait a bit longer for support.

To see it in action, try it out yourself in with our tech-demo at [http://getaroom.io](http://getaroom.io) on your Android smart-phone or tablet in a WebRTC enabled browser.




## How do I get started building cool stuff with SkywayJS myself?

### Step 1: Get an API key

To identify yourself against our API, you'll need to sign up through our [Developer Console](https://developer.temasys.com.sg) and get an API key. During our current beta phase, the usage of our platform is free, however once we are out of beta there is a tiny per-minute fee for the time that your users are connected to our infrastructure. In any case, newly created primary API keys come with a substantial allotment of free use to allow you to build, experiment, and test without up-front costs.

### Step 2: Include SkywayJS into your website

{% highlight html %}
<html>
<head>
    <title>WebRTC with SkywayJS</title>

    <script src="//cdn.temasys.com.sg/skyway/skywayjs/0.4.x/skyway.complete.min.js"></script>
</head>
<body>

  <video id="myvideo" style="transform: rotateY(-180deg);" autoplay muted></video>

</body>
</html>
{% endhighlight %}

Here you have the choice to use our "Complete" version with all dependencies or, if you want to do dependency management yourself with e.g. [RequireJS](http://requirejs.org/) or other client-side package managers, the "Library" version. [Here is an overview of these files](https://github.com/Temasys/SkywayJS/releases).

In our simple example above, we just include the complete version in a script tag in the header. The body itself only contains a video tag to show your own camera picture later. We used a CSS transform to mirror the image so it feels more natural and muted the audio, so you don't hear yourself speaking. The *autoplay* attribute is needed in some browsers where you'd otherwise only see a picture of yourself.


### Step 3: Instantiate Skyway and subscribe events

{% highlight javascript %}
var skyway = new Skyway();
{% endhighlight %}
Create a new Skyway object and subscribe events using the *on()* function. Here are the most basic ones you'll need for a simple audio/video conference.

{% highlight javascript %}
skyway.on('peerJoined', function(peerId, peerInfo, isSelf) {
  if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
  var vid = document.createElement('video');
  vid.autoplay = true;
  vid.muted = true; // Added to avoid feedback when testing locally
  vid.id = peerId;
  document.body.appendChild(vid);
});
{% endhighlight %}
**[peerJoined](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#event_peerJoined):** informs you that a peer has joined the room and shares their *peerID* and *peerInfo* a with you. In the example we create a new video element for this peer and use the peerId to identify this element in the DOM of our website.
{% highlight javascript %}
skyway.on('incomingStream', function(peerId, stream, isSelf) {
  if(isSelf) return;
  var vid = document.getElementById(peerId);
  attachMediaStream(vid, stream);
});
{% endhighlight %}
**[incomingStream](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#event_incomingStream):** This event is fired after **peerJoined** when SkywayJS starts receiving the audio and video streams from that peer. This peer could be yourself in which case the event is fired when the user grants access to his microphone and/or camera and has joined a room successfully. In the example we use the *attachMediaStream()* function of our enhanced [AdapterJS](http://github.com/Temasys/AdapterJS) library to feed this stream into our previously created video tag. Why do we use this function? The different browser vendors have slightly different ways to do this and *attachMediaStream()* enables us to abstract this.
{% highlight javascript %}
skyway.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var vid = document.getElementById(peerId);
  document.body.removeChild(vid);
});
{% endhighlight %}
**[peerLeft](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#method_peerLeft):** informs you that a peer has left the room. In our example, we look in the DOM for the video element with the events peerId and remove it.
{% highlight javascript %}
skyway.on('mediaAccessSuccess', function(stream) {
  var vid = document.getElementById('myvideo');
  attachMediaStream(vid, stream);
});
{% endhighlight %}
**[mediaAccessSuccess](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#event_mediaAccessSuccess):** The user needs to authorize his browser to allow your website access to their camera, microphone or both. Once the user clicks "Allow" in his browser, this event fires and give us access to the audio/video stream. As you'd guess **mediaAccessError** will be triggered if the user declines.


### Step 4: Initialize and joinRoom

{% highlight javascript %}
skyway.init({
  apiKey: 'Your API key',
  defaultRoom: 'Pick a room name'
});
{% endhighlight %}
By calling *[init](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#method_init)* SkywayJS starts establishing a signaling connection with our servers and requires your API key as a parameter. This connection introduces new peers and sends control messages as required for the connection and handshake process between peers. You can also pass a *defaultRoom* parameter.

{% highlight javascript %}
skyway.joinRoom({
    audio: true,
    video: true
});
{% endhighlight %}
*[joinRoom](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html#method_joinRoom)* then tells our servers that you now want to inform the other peers in the room, that you're joining and you are able to specify the features that you want to have enabled. In this case we establish both audio and video streams. You don't need to pass anything if you just want to send chat messages or data streams.


### Step 5: Profit

You've created a simple video conference. Easy, right? You can find an overview of all the methods and events Skyway offers (like *lockRoom*, *disableAudio* or *disableVideo*, etc...) in our [API doc](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html).

Have fun, share this and let us know if you run into any [issues](http://github.com/Temasys/SkywayJS/issues)!



## Resources

- [Temasys Developer Console](https://developer.temasys.com.sg) - Get your API key
- [Skyway API Documentation](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html)
- [SkywayJS version history](https://github.com/Temasys/SkywayJS/releases)
- [SkywayJS source-code on Github](http://github.com/Temasys/SkywayJS)
- [How to get support or contribute](http://temasys.github.io/support)
- [Getaroom.io tech-demo built using React and SkywayJS](http://getaroom.io)


