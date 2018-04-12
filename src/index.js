import { record } from './vars.js';

class Slot {
    constructor(signal, listener, ctx, once = false){
        this.signal = signal;
        this.next = null;

        this.prev = signal.last;
        signal.last = signal.last.next = this;

        this.listener = listener;
        this.ctx = ctx;
        this.once = once;
    }
    remove(){
        if(this.signal.last.listener === this.listener){
            this.signal.last = this.prev;
        }

        this.prev.next = this.next;
    }
}

class Signal {
    constructor(context){
        this.ctx = context;
        this.start = {next:null};
        this.last = this.start;
    }
    add(listener, ctx = null, once){

        return new Slot(
            this,
            listener,
            ctx || this.ctx,
            once
        );
    }
    dispatch(...args){
        let next = this.start;

        while(next = next.next){
            next.listener.apply(
                next.ctx,
                args
            );

            if(next.once){
                next.remove();
            }
        }

        return this;
    }
    remove(listener){
        let next = this.start;

        while(next = next.next){
            if(next.listener === listener){
                next.remove();
            }
        }

        return this;
    }
    removeAll(){
        this.start = {};
        return this;
    }
    once(listener, ctx = null){
        this.add(listener, ctx, true);
        return this;
    }
}

export function connect(obj, name){
    if(!record.has(obj)){
        record.set(obj, {});
    }

    let signals = record.get(obj);

    if(signals[name] === void 0){
        signals[name] = new Signal(obj);
    }

    return signals[name];
}

class SignalCollection {
    constructor(signals){
        this.signals = signals;
    }
    remove(){
        for(let i=0; i<this.signals.length; i++){
            this.signals[i].remove();
        }
    }
}

connect.init = function(obj, listeners, ctx){
    let keys = Object.keys(listeners);
    let signals = [];

    for(let i=0; i<keys.length; i++){
        signals.push(
            connect(obj, keys[i])
            .add(listeners[keys[i]], ctx)
        );
    }

    return new SignalCollection(signals);
};
