import WeakMap from 'es6-weak-map';

export const top = typeof global !== 'undefined'
? global
: typeof self !== 'undefined'
? self
: window.top;

if(typeof top.__signal_record__ === 'undefined'){
    Object.defineProperty(top, '__signal_record__', {
        value: new WeakMap()
    });
}

export const record = top.__signal_record__;
