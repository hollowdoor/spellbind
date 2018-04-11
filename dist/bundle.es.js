import WeakMap from 'es6-weak-map';

var top = typeof global !== 'undefined'
? global
: typeof self !== 'undefined'
? self
: window.top;

if(typeof top.__signal_record__ === 'undefined'){
    Object.defineProperty(top, '__signal_record__', {
        value: new WeakMap()
    });
}

var record = top.__signal_record__;

var Slot = function Slot(signal, listener, ctx, once){
    if ( once === void 0 ) once = false;

    this.signal = signal;
    this.next = null;

    this.prev = signal.last;
    signal.last = signal.last.next = this;

    this.listener = listener;
    this.ctx = ctx;
    this.once = once;
};
Slot.prototype.remove = function remove (){
    if(this.signal.last.listener === this.listener){
        this.signal.last = this.prev;
    }

    this.prev.next = this.next;
};

var Signal = function Signal(context){
    this.ctx = context;
    this.start = {next:null};
    this.last = this.start;
};
Signal.prototype.add = function add (listener, ctx, once){
        if ( ctx === void 0 ) ctx = null;


    return new Slot(
        this,
        listener,
        ctx || this.ctx,
        once
    );
};
Signal.prototype.dispatch = function dispatch (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    var next = this.start;

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
};
Signal.prototype.remove = function remove (listener){
    var next = this.start;

    while(next = next.next){
        if(next.listener === listener){
            next.remove();
        }
    }

    return this;
};
Signal.prototype.removeAll = function removeAll (){
    this.start = {};
    return this;
};
Signal.prototype.once = function once (listener, ctx){
        if ( ctx === void 0 ) ctx = null;

    this.add(listener, ctx, true);
    return this;
};

function connect(obj, name){
    if(!record.has(obj)){
        record.set(obj, {});
    }

    var signals = record.get(obj);

    if(signals[name] === void 0){
        signals[name] = new Signal(obj);
    }

    return signals[name];
}

export { connect };
//# sourceMappingURL=bundle.es.js.map
