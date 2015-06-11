---
layout: post
title: Getting started with WebRTC and SkylinkJS
category: How-To
author: Thomas Gorissen

excerpt: Building a simple audio/video conferencing website that doesn't need any server-side code and works with up to 8-10 peers on a modern computer and even up to 4 people on recent Android phones.

---

You may have heard of WebRTC and its magical abilities recently and, like many, you might have found yourself struggling with trying to get even a simple demo going. The team here at Temasys built SkylinkJS to address this and make it easy to build reliable peer connectivity solutions on any website with the help of WebRTC.

Here is an example codepen that we've created that shows how you can create a very simple audio/video conference with merely 35 lines of JavaScript client-side code, with no additional server-code required.

<p data-height="370" data-theme-id="7751" data-slug-hash="nKvBu" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/serrynaimo/pen/nKvBu/'>WebRTC with SkylinkJS</a> by Thomas Gorissen (<a href='http://codepen.io/serrynaimo'>@serrynaimo</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

To further demonstrate the possibilities and flexibility of SkylinkJS, I've also created a more elaborate demo created with the help of [Facebooks React](http://facebook.github.io/react/) at [http://getaroom.io](http://getaroom.io). Check it out, share it, and and use it if you like it.




## How does this work?

### Skylink: BaaS for multi-media peer connectivity

Temsys has created the super scalable Skylink backend-as-a-service that helps to connect two or more peers very reliably and easily. It was designed specifically for [WebRTC](http://en.wikipedia.org/wiki/WebRTC), which enables your browser to send data directly to another browser. That data can be a chat message, a file or even an audio/video stream from your devices camera and microphone thus allowing you to create all kinds of cool real-time video conferencing, collaboration, tutoring and other live-presence use-cases.

### The SkylinkJS library

WebRTC is still a rather low-level browser API and requires you to do significant work around solving signaling issues and resolving differences in implementation between web browsers. We at Temasys are part of the [WebRTC working group at the W3C](http://www.w3.org/2011/04/webrtc-charter.html) and create solutions with and around WebRTC for more than a year now. We know this part of the puzzle inside and out, and that is why we have created SkylinkJS. We want to solve the connectivity and implementation headaches for you and let you focus on building the cool stuff.

### App keys, alias keys, realms, rooms and peers

<img src="/resources/img/realmsandrooms.png" style="float:left; margin-right: 20px;" />When you use SkylinkJS in your <em style="color: MediumVioletRed; background-color: #fff; border: 1px solid MediumVioletRed;">website</em> or <em style="color: MediumVioletRed; background-color: #fff; border: 1px solid MediumVioletRed;">app</em>, you can invite users (we call them <em style="color: goldenrod; background-color: #fff; border: 1px solid goldenrod;">peers</em>) to join a shared space in which they can exchange data privately with each other. We call this space a <em style="color: firebrick; background-color: #fff; border: 1px solid firebrick;">room</em>. Every peer that wants to join a room needs to know its unique identifier, like a secure, generated token or a simple name. We leave it up to you on how you come up with these room IDs and how you inform peers about them. One of our primary goals in SkylinkJS was to not interfere with your application logic or UX. We recommend generating [UUIDs](http://jsfiddle.net/briguy37/2MVFd/) as a best-practice here for making the identifiers difficult to guess, reasonably unique and providing an additional layer of privacy of your users during room sessions.

You identify yourself to the Skylink Infrastructure with your unique <em style="color: mediumblue; background-color: #fff; border: 1px solid mediumblue;">App key</em> that you can create in our [Developer Console](https://developer.temasys.com.sg) or via our REST API. Every App key creates a new <em style="color: darkgreen; background-color: #fff; border: 1px solid darkgreen;">realm</em> in which your rooms can exist. Every App key will only work on your specified [CORS domain name](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing). If you want to have a different website or app access the same realm and therefor the same rooms, you are also able to create <em style="color: mediumblue; background-color: #fff; border: 1px solid mediumblue;">alias keys</em> that extend the scope of the realm to other domains or simply isolate your apps various flavors for logging and reporting purposes.


### Compatibility and Performance

Only Google Chrome and Mozilla Firefox support the technology natively in their current versions. We thought that wasn't good enough and therefor created plugins for Mac and Windows to upgrade Safari and Internet Explorer to support the current WebRTC standard as well. [They're available for free download here.](http://skylink.io/plugin/)

It's still early days for WebRTC, but assuming a modern multi-core processor and broadband internet connection you can reasonably expect to achieve 8-10 peers in an audio/video conference.

Chrome for Android supports WebRTC as well, but however due to the less powerful CPUs found in the many mobile devices an expectation of three peers is more likely with more possible on latest devices with hardware VP8 acceleration. Users on iOS and other mobile OS will still have to wait a bit longer for support.

To see it in action, try it out yourself in with our tech-demo at [http://getaroom.io](http://getaroom.io) on your Android smart-phone or tablet in a WebRTC enabled browser.




## How do I get started building cool stuff with SkylinkJS myself?

### Step 1: Get an App key

To identify yourself against our API, you'll need to sign up through our [Developer Console](https://developer.temasys.com.sg) and get an App key. During our current beta phase, the usage of our platform is free, however once we are out of beta there is going to be a very affordable charge for our infrastructure services. In any case, newly created primary App keys come with a substantial allotment of free use to allow you to build, experiment, and test without up-front costs.

### Step 2: Include SkylinkJS into your website

{% highlight html %}
<html>
<head>
    <title>WebRTC with SkylinkJS</title>

    <script src="//cdn.temasys.com.sg/skylink/skylinkjs/0.5.x/skylink.complete.min.js"></script>
</head>
<body>

  <video id="myvideo" style="transform: rotateY(-180deg);" autoplay muted></video>

</body>
</html>
{% endhighlight %}

Here you have the choice to use our "Complete" version with all dependencies or, if you want to do dependency management yourself with e.g. [RequireJS](http://requirejs.org/) or other client-side package managers, the "Library" version. [Here is an overview of these files](https://github.com/Temasys/SkylinkJS/releases).

In our simple example above, we just include the complete version in a script tag in the header. The body itself only contains a video tag to show your own camera picture later. We used a CSS transform to mirror the image so it feels more natural and muted the audio, so you don't hear yourself speaking. The *autoplay* attribute is needed in some browsers where you'd otherwise only see a picture of yourself.


### Step 3: Instantiate Skylink and subscribe events

{% highlight javascript %}
var skylink = new Skylink();
{% endhighlight %}
Create a new Skylink object and subscribe events using the *on()* function. Here are the most basic ones you'll need for a simple audio/video conference.

{% highlight javascript %}
skylink.on('peerJoined', function(peerId, peerInfo, isSelf) {
  if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
  var vid = document.createElement('video');
  vid.autoplay = true;
  vid.muted = true; // Added to avoid feedback when testing locally
  vid.id = peerId;
  document.body.appendChild(vid);
});
{% endhighlight %}
**[peerJoined](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#event_peerJoined):** informs you that a peer has joined the room and shares their *peerID* and *peerInfo* a with you. In the example we create a new video element for this peer and use the peerId to identify this element in the DOM of our website.
{% highlight javascript %}
skylink.on('incomingStream', function(peerId, stream, isSelf) {
  if(isSelf) return;
  var vid = document.getElementById(peerId);
  attachMediaStream(vid, stream);
});
{% endhighlight %}
**[incomingStream](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#event_incomingStream):** This event is fired after **peerJoined** when SkylinkJS starts receiving the audio and video streams from that peer. This peer could be yourself in which case the event is fired when the user grants access to his microphone and/or camera and has joined a room successfully. In the example we use the *attachMediaStream()* function of our enhanced [AdapterJS](http://github.com/Temasys/AdapterJS) library to feed this stream into our previously created video tag. Why do we use this function? The different browser vendors have slightly different ways to do this and *attachMediaStream()* enables us to abstract this.
{% highlight javascript %}
skylink.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var vid = document.getElementById(peerId);
  document.body.removeChild(vid);
});
{% endhighlight %}
**[peerLeft](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#method_peerLeft):** informs you that a peer has left the room. In our example, we look in the DOM for the video element with the events peerId and remove it.
{% highlight javascript %}
skylink.on('mediaAccessSuccess', function(stream) {
  var vid = document.getElementById('myvideo');
  attachMediaStream(vid, stream);
});
{% endhighlight %}
**[mediaAccessSuccess](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#event_mediaAccessSuccess):** The user needs to authorize his browser to allow your website access to their camera, microphone or both. Once the user clicks "Allow" in his browser, this event fires and give us access to the audio/video stream. As you'd guess **mediaAccessError** will be triggered if the user declines.


### Step 4: Initialize and joinRoom

{% highlight javascript %}
skylink.init({
  apiKey: 'Your App key',
  defaultRoom: 'Pick a room name'
});
{% endhighlight %}
By calling *[init](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#method_init)* SkylinkJS starts establishing a signaling connection with our servers and requires your App key as a parameter. This connection introduces new peers and sends control messages as required for the connection and handshake process between peers. You can also pass a *defaultRoom* parameter.

{% highlight javascript %}
skylink.joinRoom({
    audio: true,
    video: true
});
{% endhighlight %}
*[joinRoom](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html#method_joinRoom)* then tells our servers that you now want to inform the other peers in the room, that you're joining and you are able to specify the features that you want to have enabled. In this case we establish both audio and video streams. You don't need to pass anything if you just want to send chat messages or data streams.


### Step 5: Profit

You've created a simple video conference. Easy, right? You can find an overview of all the methods and events Skylink offers (like *lockRoom*, *disableAudio* or *disableVideo*, etc...) in our [API doc](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html).

Have fun, share this and let us know if you run into any [issues](http://github.com/Temasys/SkylinkJS/issues)!



## Resources

- [Temasys Developer Console](https://developer.temasys.com.sg) - Get your App key
- [Skylink API Documentation](http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html)
- [SkylinkJS version history](https://github.com/Temasys/SkylinkJS/releases)
- [SkylinkJS source-code on Github](http://github.com/Temasys/SkylinkJS)
- [How to get support or contribute](https://developer.temasys.com.sg/support)
- [Getaroom.io tech-demo built using React and SkylinkJS](http://getaroom.io)


