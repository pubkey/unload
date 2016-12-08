#javascript: unload

## The question: How can I make my npm-module to run a piece of code when my javascript-process exits?
## The answer: Add a handler to ```process.on('exit')```.

So, problem solved..

..but wait, this will only run if the nodejs-process runs the .exit()-function.
But I want my handler to also run when an exception exits the process.
Ok, so I will also use ```process.on('uncaughtException')```.
But this wont work when Ctrl-C is pressed, so now I also need ```process.on('SIGINT')```. 

But what happens if my npm-module is used in the browser?

Well, we now also need to use ```window.onunload``` which wont work on safari-mobile where we need a workarround.
And what about electron? And what about react-native? What about cordova/phonegap?

# The Solution
Lets create a npm-module for this which works in **all javascript environments**.

```js
  var unload = require('unload');
  unload(function(){
    console.log("Ouch, I'm dying.");
  });
```

If you want to remove the eventListeners, call the returned function.
```js
  var unload = require('unload');
  var stopListen = unload(function(){
    console.log("Ouch, I'm dying.");
  });
  
  stopListen(); // removes the event-listeners
```



