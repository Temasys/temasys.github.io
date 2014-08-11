---
layout: post
title: Getting started with WebRTC and SkywayJS
category: How-To
author: Thomas Gorissen

excerpt: Building a simple audio/video conferencing website that doesn't need any server-side code and works with up to 8-10 peers on a modern computer and even up to 4 people on recent Android phones.

---

If you've heard about WebRTC and its magic abilities recently, you might have found yourself struggling trying to get even a simple demo going. We wrote SkywayJS to fix this and make it easy to to build reliable peer connectivity solutions on any website with the help of WebRTC.

Here is an example codepen that we've created that shows how you can create a very simple audio/video conference with merely 32 lines of JavaScript code and no server-code required.

<p data-height="440" data-theme-id="7751" data-slug-hash="nKvBu" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/serrynaimo/pen/nKvBu/'>WebRTC with SkywayJS</a> by Thomas Gorissen (<a href='http://codepen.io/serrynaimo'>@serrynaimo</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

I've also created a more elaborate demo created with the help of [Facebooks React](http://facebook.github.io/react/) at [http://getaroom.io](http://getaroom.io) for you to check out and use if you like it.



## How does this work?

### Skyway: IaaS for multi-media peer connectivity

Temsys has created the super scalable Skyway infrastructure that helps to very reliably and easily connect two or more peers. It works great with [WebRTC](http://en.wikipedia.org/wiki/WebRTC), which enables your browser to send data directly to another browser. That data can be a chat message, a file or even an audio/video stream from your devices camera and microphone thus allowing you to create all kinds of cool real-time video conferencing, collaboration, tutoring and other live-presence use-cases.

### The SkywayJS library

WebRTC is still a rather low-level browser API and requires you to do a lot of work to solve signaling issues and deal with differences of implementation between webbrowsers. That's why Temasys has created SkywayJS which solves all these problems for you.

### API keys, alias keys, realms, rooms and peers

When you use SkywayJS in your website or app, you can invite users (we call them "peers") to join a common space in which they can exchange data privately with each other. We call this space a "room". Every peer that wants to join a room needs to know its unique identifier, like a secure, generated token or a simple name. We leave it up to you on how you come up with these room IDs and how you inform peers about it. In most cases generating a [UUID](http://jsfiddle.net/briguy37/2MVFd/) might be the best idea to make sure the privacy of your users during the conversation is protected.

You identify yourself to the Skyway Infrastructure with your unique "API key" that you can retrieve in our [Developer Console](https://developer.temasys.com.sg). Every API key creates a new "realm" in which your rooms can exist. Every API key will only work on your specified [CORS domain name](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing). If you want to have a different website or app access the same realm and therefor the same rooms, you'll need to create a so called "Alias key".

### Performance

It's still early days for WebRTC, but depending on how powerful your CPU and how good your network throughput is, you can get 8-10 peers into an audio/video conference on a modern laptop computer. Chrome on Android supports WebRTC as well, but suffers from the smaller CPU in your mobile devices and starts struggeling with 4 peers. Try it out yourself with our tech-demo at [http://getaroom.io](http://getaroom.io).



## How to build cool stuff with it yourself

### Step 1: Get an API key

To identify yourself against our API, you'll need to sign up through [Developer Console](https://developer.temasys.com.sg) and get an API key. During our current beta phase the usage of our platform is free, but once we're gonna charge a tiny fee per minute that you're connected to our infrastructure. In any case, new API keys will always come with a good bunch of free included minutes, so you can try it all out.

### Step 2: Include SkywayJS into your website

Here you have the choice to use our "Complete" version with all dependencies or, if you want to do dependency management yourself with [Bower](http://bower.io/), [RequireJS](http://requirejs.org/) or other client-side package managers, the "Library" version. [Here is an overview of these files](https://temasys.atlassian.net/wiki/display/TPD/Introducing+SkywayJS#IntroducingSkywayJS-Versionsupportandreleases).

In our simple example above, we just include the complete version in a script tag in the header.

### Step 3: Instantiate Skyway and subscribe events

In the codepen example above you see the most basic events you'll need if you want to create a simple audio/video conference.

- **peerJoined:** informs you that another peer has joined the room and shares our peerID with you. In the example we create a new video element for this peer and use the peerId to identify this tag in the DOM of our website.
- **peerLeft:** informs you that a peer has left the room. We look in the DOM for the video element with its peerId and remove it.
- **addPeerStream:** This event is fired after **peerJoined** when SkywayJS starts receiving the audio and video streams from that peer. In the example we use the *attachMediaStream()* function of our [AdapterJS](http://github.com/Temasys/AdapterJS) library to feed this stream into our previously created video tag. Why do we use this function? The different browser vendors have slightly different ways to do this and *attachMediaStream()* helps us to abstract this.
- **mediaAccessSuccess:** The user needs to authorize your website that he's okay with sharing his camera and microphone. Once the user clicks "Allow" in his browser, this event fires and give us access to the audio/video stream. As you'd guess **mediaAccessError** would trigger if the user declines.

### Step 4: Initialize and joinRoom

By calling *init()* SkywayJS starts establishing a signaling connection with our servers and requires your API key as a parameter. This connection introduces new peers and sends basic messages between peers that are required for the process. You can also pass a *defaultRoom* parameter.

*joinRoom* then tells our servers that you now want to inform the other peers in the room, that you're joining and you can specificy the features that you want to have enabled. In this case we want audio and video streams to be established.

### Step 5: Profit

You've created a simple video conference. Easy, right? You can find an overview of all the methods and events Skyway offers (like *lockRoom*, *disableAudio* or *disableVideo*, etc...) in our API doc. Find the right doc for the version of Skyway you're using [in our version history](https://temasys.atlassian.net/wiki/display/TPD/Introducing+SkywayJS#IntroducingSkywayJS-Versionsupportandreleases).

Have fun and let us know if you run into any [issues](http://github.com/Temasys/SkywayJS/issues)!



## Resources

- [Temasys Developer Console](https://developer.temasys.com.sg) - Get your API key
- [SkywayJS Documentation](https://temasys.atlassian.net/wiki/display/TPD/Introducing+SkywayJS)
- [SkywayJS version history](https://temasys.atlassian.net/wiki/display/TPD/Introducing+SkywayJS#IntroducingSkywayJS-Versionsupportandreleases)
- [SkywayJS source-code on Github](http://github.com/Temasys/SkywayJS)
- [How to get support or contribute](http://temasys.github.io/support)
- [Getaroom.io tech-demo build with React and SkywayJS](http://getaroom.io)


