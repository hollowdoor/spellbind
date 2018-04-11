spellbind
===

Install
---

`npm install spellbind`

Usage
---

```javascript
import { connect } from 'spellbind';

class Listener {
    constructor(){
        this.message = "I'm listening";
    }
}

let obj = new Listener();

let m = connect(obj, 'message 1')

m.add(()=>{
    console.log('ok 1');
});

m.add(()=>{
    console.log('ok 2');
});

connect(obj, 'messaged 1').dispatch();

connect(obj, 'messaged 2').add(function(val){
    console.log(this.message);
    console.log(val);
});

connect(obj, 'messaged 2').once(function(){
    console.log('only once');
});

connect(obj, 'messaged 2').dispatch('a value');
connect(obj, 'messaged 2').dispatch();
```

About
---
