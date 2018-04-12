spellbind
===

Install
---

`npm install spellbind`

Usage
---

### Import

```javascript
import { connect } from 'spellbind';
//Create a class for using signals on
class Receiver {
    constructor(){
        this.message = "I'm listening";
    }
}
//We'll use this instance for signals
let receiver = new Receiver();
```

### Basic

```javascript
//Connect the object (receiver) to
//a property named "messaged"
let link = connect(receiver, 'messaged')
//Set up listeners to receive a message
let slot1 = link.add(message=>{
    //Prints "Hello universe!" to the console
    console.log(message);
});

let cb2 = message=>{
    //Adds "Hello universe!" to the document
    document.body.innerHTML = message;
};

link.add(cb2);
//Send a message using the dispatch method
connect(receiver, 'messaged').dispatch('Hello universe!');
```

### Remove listeners

```javascript
//Remove a listener to stop receiving messages
//using it's own remove method
slot1.remove();
//Remove by listener (like element.removeEventListener)
link.remove(cb2);
//Remove all listeners
link.removeAll();
```

### Changing listener context

```javascript
let myContext = {notice:"This is my context"};
//Pass a value to the second argument of add
//to change the context of the listener
connect(receiver, 'messaged 2').add(function(){
    //Print "This is my context"
    console.log(this.notice);
}, myContext);
```

### Firing once

```javascript
//Listeners added with the once method
//will fire, and be removed immediately
connect(receiver, 'messaged 2').once(function(){
    console.log('Fired only once');
});
//Use the third argument in the add method to
//make a listener fire once
connect(receiver, 'messaged 2').add(function(){
    console.log('Fired only once');
}, null, true);

connect(receiver, 'messaged 2').dispatch();
```

About
---
