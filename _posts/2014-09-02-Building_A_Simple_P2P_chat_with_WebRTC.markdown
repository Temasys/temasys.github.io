---
layout: post
title: Building A Simple Peer-to-Peer WebRTC Chat
category: How-To
author: Thomas Gorissen

excerpt: Audio/Video is not the only thing that WebRTC enables you to do. The data channel offers a variety of use-cases, too, to send information from one peer to another without going through a server. In this tutorial I show you how to build a simple chat.

---

Audio/Video communication is not the only thing that WebRTC enables you to do. The data channel offers a variety of use-cases, too, by sending information from one peer to another without going through a server. In this tutorial I show you how to build a simple chat.

<p data-height="330" data-theme-id="7751" data-slug-hash="asIzB" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/serrynaimo/pen/asIzB'>WebRTC Chat with SkywayJS</a> by Thomas Gorissen (<a href='http://codepen.io/serrynaimo'>@serrynaimo</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

I'm using our open-source [SkywayJS](https://github.com/Temasys/SkywayJS) library to build this. It takes care of the hard parts of introducing peers in different network environments and makes WebRTC really easy to use. If you haven't seen my Getting Started tutorial, [you can find it here](http://temasys.github.io/how-to/2014/08/08/Getting_started_with_WebRTC_and_SkywayJS/).

**Tip:** You can click on the function and event names in this tutorial to see the corresponding entry in our [API documentation](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html).


### Step 1: Include SkywayJS into your website

{% highlight html %}
<html>
<head>
    <title>WebRTC chat with SkywayJS</title>

    <script src="//cdn.temasys.com.sg/skyway/skywayjs/0.4.x/skyway.complete.min.js"></script>
</head>
<body>

  <header>
    <input type="text" id="name" placeholder="My name" autofocus />
    <button onclick="setName()">Set my name</button>
    <button onclick="joinRoom()">Join room</button>
    <button onclick="leaveRoom()">Leave room</button>
    <br/>
    <input type="text" id="message" placeholder="My message" />
    <button onclick="sendMessage()">Send message</button>
  </header>

  <div id="container">
    <div id="chatbox"></div>
  </div>

</body>
</html>
{% endhighlight %}

In the head of our super simple chat website I embed the complete version of SkywayJS. It comes with all the dependencies that I need to get started. In the header I add input fields for my name and chat messages and some buttons that allow me to trigger my *setName()*, *joinRoom()*, *leaveRoom()* and *sendMessage()* functions later. The two divs underneath is where I want the chat messages to appear.


### Step 2: Instantiate Skyway and creating simple helper functions

{% highlight javascript %}
var skyway = new Skyway();
{% endhighlight %}
I create a new Skyway object and now go on to define the functions that I was referencing in the *onclick* attribute of my buttons before. The following lines of code describe where we get to trigger actions on Skyway that other peers then will receive and react to.

{% highlight javascript %}
function setName() {
  var input = document.getElementById('name');
  skyway.setUserData({
    name: input.value
  });
}
{% endhighlight %}
In the *setName* function, we simply read out the string value that the user has written into our **name** input field and use Skyway *[setUserData](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_setUserData)()* function to pass any kind of user information in form of a JavaScript object into Skyway. This can be done before or after you join a room context and will automatically become available to every peer joining the same room context.

{% highlight javascript %}
function joinRoom() {
  skyway.joinRoom();
}
{% endhighlight %}
Here I just call *[joinRoom](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_joinRoom)()* on Skyway. This tells the Skyway signaling server that I'm now ready to be connected to other peers joining the default room context.

{% highlight javascript %}
function leaveRoom() {
  skyway.leaveRoom();
}
{% endhighlight %}
*[leaveRoom](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_leaveRoom)()* leaves little surprise here.

{% highlight javascript %}
function sendMessage() {
  var input = document.getElementById('message');
  skyway.sendP2PMessage(input.value);
  input.value = '';
}
{% endhighlight %}
This is really where the magic happens. I use the *[sendP2PMessage](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_sendP2PMessage)()* function to directly send my string message from the **message** input field to all connected peers in my room. This happens one-by-one in a peer-to-peer fashion and through an encrypted transmission. No data touches a server. It's a great way to have super private conversations. (Be aware: This is pretty safe to use for private data exchange, but nothing is ever totally safe!)

{% highlight javascript %}
function addMessage(message, className) {
  var chatbox = document.getElementById('chatbox'),
    div = document.createElement('div');
  div.className = className;
  div.textContent = message;
  chatbox.appendChild(div);
}
{% endhighlight %}
This is my helper function to add a new message to the **chatbox** div that I created earlier. I can also pass a *className* variable to leverage CSS, so I can make different messages stand out. I use the *textContent* property of the div element to avoid that somebody can send me script tags or HTML inside a message that gets executed.


### Step 3: Subscribing the Skyway events

When we use the functions above on one peer in the room, the other peers will get notified. Skyway informs them with events. In order for us to react to those event, we need to subscribe to them and execute our own functionality when they get triggered.

{% highlight javascript %}
skyway.on('peerJoined', function(peerId, peerInfo, isSelf) {
  var user = 'You';
  if(!isSelf) {
    user = peerInfo.userData.name || peerId;
  }
  addMessage(user + ' joined the room', 'action');
});
{% endhighlight %}
**[peerJoined](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#event_peerJoined):** When somebody joins the chat room, I want to be informed and show a little action message. I use the *isSelf* parameter to determine if it's myself joining the room or somebody else and in the latter case I use Skyways *peerInfo* attribute to retrieve the userData object that the user might have set earlier using Skyways **[setUserData](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_setUserData)** function. If there is no name set yet, I fall back and use Skyways *peerId*.

{% highlight javascript %}
skyway.on('peerUpdated', function(peerId, peerInfo, isSelf) {
  if(isSelf) {
    user = peerInfo.userData.name || peerId;
    addMessage('You\'re now known as ' + user, 'action');
  }
});
{% endhighlight %}
**[peerUpdated](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#event_peerUpdated):** It may happen that a peer updates its userData object while connected to the room. In this case the **peerUpdated** event is fired. I receive the new userData object the same way I got it in the **peerJoined** event earlier.

{% highlight javascript %}
skyway.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var user = 'You';
  if(!isSelf) {
    user = peerInfo.userData.name || peerId;
  }
  addMessage(user + ' left the room', 'action');
});
{% endhighlight %}
**[peerLeft](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#event_peerLeft):** When a peer leaves the chatroom, I also write a short message into the chat room to inform the user.

{% highlight javascript %}
skyway.on('incomingMessage', function(message, peerId, peerInfo, isSelf) {
  var user = 'You',
    className = 'you';
  if(!isSelf) {
    user = peerInfo.userData.name || peerId;
    className = 'message';
  }
  addMessage(user + ': ' + message.content, className);
});
{% endhighlight %}
**[incomingMessage](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#event_incomingMessage):** This event is triggered whenever Skyway receives a public or private message from another peer. Messages sent with *sendP2PMessage()* are always private messages, although they could have been sent to multiple peers. If you want to find out if a message was a non-peer-to-peer public broadcast, you can check *peerInfo.isPrivate* to be false.


### Step 4: Initialize!

{% highlight javascript %}
skyway.init('Your API key');
{% endhighlight %}
By calling *[init](http://cdn.temasys.com.sg/skyway/skywayjs/0.4.2/doc/classes/Skyway.html#method_init)()* SkywayJS starts establishing a signaling connection with our servers and requires your API key as a parameter. Only after calling this function, you're able to join room contexts.

If you don't have one yet, you can register and get your own API key using our [Developer Console]([Temasys Developer Console](https://developer.temasys.com.sg). I'm aware you can make a lot fancier of a chat than this, but I think this example shows pretty well that creating a chat is not as hard anymore as it used to be. :) Leave us your feedback in our [developer chat](http://livesupport.temasys.com.sg/)! I'd love to hear from you.


## Resources

- [Temasys Developer Console](https://developer.temasys.com.sg) - Get your API key
- [Skyway API Documentation](http://cdn.temasys.com.sg/skyway/skywayjs/latest/doc/classes/Skyway.html)
- [SkywayJS version history](https://github.com/Temasys/SkywayJS/releases)
- [SkywayJS source-code on Github](http://github.com/Temasys/SkywayJS)
- [How to get support or contribute](http://temasys.github.io/support)


