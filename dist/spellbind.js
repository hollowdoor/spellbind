var spellbind = (function (exports) {
'use strict';

var isImplemented = function () {
	var weakMap, x;
	if (typeof WeakMap !== 'function') { return false; }
	try {
		// WebKit doesn't support arguments and crashes
		weakMap = new WeakMap([[x = {}, 'one'], [{}, 'two'], [{}, 'three']]);
	} catch (e) {
		return false;
	}
	if (String(weakMap) !== '[object WeakMap]') { return false; }
	if (typeof weakMap.set !== 'function') { return false; }
	if (weakMap.set({}, 1) !== weakMap) { return false; }
	if (typeof weakMap.delete !== 'function') { return false; }
	if (typeof weakMap.has !== 'function') { return false; }
	if (weakMap.get(x) !== 'one') { return false; }

	return true;
};

var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

var isImplemented$1 = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") { return false; }
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

// eslint-disable-next-line no-empty-function
var noop = function () {};

var _undefined = noop(); // Support ES3 engines

var isValue = function (val) {
 return (val !== _undefined) && (val !== null);
};

var map = { function: true, object: true };

var isObject = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};

var validValue = function (value) {
	if (!isValue(value)) { throw new TypeError("Cannot use null or undefined"); }
	return value;
};

var create$1 = Object.create, shim;

if (!isImplemented$1()) {
	shim = shim$1;
}

var create_1 = (function () {
	var nullObject, polyProps, desc;
	if (!shim) { return create$1; }
	if (shim.level !== 1) { return create$1; }

	nullObject = {};
	polyProps = {};
	desc = {
		configurable: false,
		enumerable: false,
		writable: true,
		value: undefined
	};
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create$1(prototype === null ? nullObject : prototype, props);
	};
}());

var objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty  = Object.defineProperty
  , nullDesc        = {
	configurable: true,
	enumerable: false,
	writable: true,
	value: undefined
}
  , validate;

validate = function (obj, prototype) {
	validValue(obj);
	if (prototype === null || isObject(prototype)) { return obj; }
	throw new TypeError("Prototype must be null or an object");
};

var shim$1 = (function (status) {
	var fn, set;
	if (!status) { return null; }
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) { delete self.nullPolyfill.__proto__; }
			if (prototype === null) { prototype = self.nullPolyfill; }
			obj.__proto__ = prototype;
			if (isNullBase) { defineProperty(self.nullPolyfill, "__proto__", nullDesc); }
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
}(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) { return { set: set, level: 2 }; }
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) { return { level: 2 }; }

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) { return { level: 1 }; }

		return false;
	})()
));

var setPrototypeOf = isImplemented$1()
	? Object.setPrototypeOf
	: shim$1;

var validObject = function (value) {
	if (!isObject(value)) { throw new TypeError(value + " is not an Object"); }
	return value;
};

var generated = Object.create(null), random = Math.random;

var randomUniq = function () {
	var str;
	do {
		str = random()
			.toString(36)
			.slice(2);
	} while (generated[str]);
	return str;
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isImplemented$2 = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") { return false; }
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

var isImplemented$3 = function () {
	try {
		return true;
	} catch (e) {
 return false;
}
};

var keys = Object.keys;

var shim$2 = function (object) {
	return keys(isValue(object) ? Object(object) : object);
};

var keys$1 = isImplemented$3()
	? Object.keys
	: shim$2;

var max   = Math.max;

var shim$3 = function (dest, src /*, …srcn*/) {
	var arguments$1 = arguments;

	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(validValue(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) { error = e; }
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments$1[i];
		keys$1(src).forEach(assign);
	}
	if (error !== undefined) { throw error; }
	return dest;
};

var assign = isImplemented$2()
	? Object.assign
	: shim$3;

var forEach = Array.prototype.forEach, create$2 = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) { obj[key] = src[key]; }
};

// eslint-disable-next-line no-unused-vars
var normalizeOptions = function (opts1 /*, …options*/) {
	var result = create$2(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) { return; }
		process(Object(options), result);
	});
	return result;
};

// Deprecated

var isCallable = function (obj) {
 return typeof obj === "function";
};

var str = "razdwatrzy";

var isImplemented$4 = function () {
	if (typeof str.contains !== "function") { return false; }
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

var indexOf = String.prototype.indexOf;

var shim$4 = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

var contains = isImplemented$4()
	? String.prototype.contains
	: shim$4;

var d_1 = createCommonjsModule(function (module) {

var d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOptions(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOptions(options), desc);
};
});

var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

var isArguments = function (value) {
	return objToString.call(value) === id;
};

var objToString$1 = Object.prototype.toString, id$1 = objToString$1.call("");

var isString = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString$1.call(value) === id$1)) ||
		false
	);
};

var validTypes = { object: true, symbol: true };

var isImplemented$5 = function () {
	if (typeof Symbol !== 'function') { return false; }
	try { } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) { return false; }
	if (!validTypes[typeof Symbol.toPrimitive]) { return false; }
	if (!validTypes[typeof Symbol.toStringTag]) { return false; }

	return true;
};

var isSymbol = function (x) {
	if (!x) { return false; }
	if (typeof x === 'symbol') { return true; }
	if (!x.constructor) { return false; }
	if (x.constructor.name !== 'Symbol') { return false; }
	return (x[x.constructor.toStringTag] === 'Symbol');
};

var validateSymbol = function (value) {
	if (!isSymbol(value)) { throw new TypeError(value + " is not a symbol"); }
	return value;
};

var create$3 = Object.create, defineProperties = Object.defineProperties
  , defineProperty$1 = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create$3(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create$3(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) { ++postfix; }
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty$1(objPrototype, name, d_1.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) { return; }
			ie11BugWorkaround = true;
			defineProperty$1(this, name, d_1(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) { throw new TypeError('Symbol is not a constructor'); }
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
var polyfill = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) { throw new TypeError('Symbol is not a constructor'); }
	if (isNativeSafe) { return NativeSymbol(description); }
	symbol = create$3(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d_1('', description),
		__name__: d_1('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d_1(function (key) {
		if (globalSymbols[key]) { return globalSymbols[key]; }
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d_1(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) { if (globalSymbols[key] === s) { return key; } }
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d_1('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d_1('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d_1('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d_1('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d_1('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d_1('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d_1('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d_1('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d_1('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d_1('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d_1('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d_1(SymbolPolyfill),
	toString: d_1('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d_1(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d_1(function () { return validateSymbol(this); })
});
defineProperty$1(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d_1('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') { return symbol; }
	return symbol.toString();
}));
defineProperty$1(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d_1('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty$1(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d_1('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty$1(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d_1('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

var es6Symbol = isImplemented$5() ? Symbol : polyfill;

var clear = function () {
	validValue(this).length = 0;
	return this;
};

var validCallable = function (fn) {
	if (typeof fn !== "function") { throw new TypeError(fn + " is not a function"); }
	return fn;
};

var isImplemented$6 = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") { return false; }
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};

var objToString$2 = Object.prototype.toString, id$2 = objToString$2.call(noop);

var isFunction = function (value) {
	return typeof value === "function" && objToString$2.call(value) === id$2;
};

var isImplemented$7 = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") { return false; }
	return (sign(10) === 1) && (sign(-20) === -1);
};

var shim$5 = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) { return value; }
	return value > 0 ? 1 : -1;
};

var sign = isImplemented$7()
	? Math.sign
	: shim$5;

var abs = Math.abs, floor = Math.floor;

var toInteger = function (value) {
	if (isNaN(value)) { return 0; }
	value = Number(value);
	if ((value === 0) || !isFinite(value)) { return value; }
	return sign(value) * floor(abs(value));
};

var max$1 = Math.max;

var toPosInteger = function (value) {
 return max$1(0, toInteger(value));
};

var iteratorSymbol = es6Symbol.iterator
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty$2 = Object.defineProperty;

// eslint-disable-next-line complexity
var shim$6 = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) { validCallable(mapFn); }
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) { return Array.apply(null, arrayLike); }
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) { arr[i] = arrayLike[i]; }
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = validCallable(getIterator).call(arrayLike);
			if (Context) { arr = new Context(); }
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty$2(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) { arr = new Context(); }
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) { value += arrayLike[++i]; }
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty$2(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInteger(arrayLike.length);
		if (Context) { arr = new Context(length); }
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty$2(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

var from = isImplemented$6()
	? Array.from
	: shim$6;

var copy = function (obj/*, propertyNames, options*/) {
	var copy = Object(validValue(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) { return copy; }
	var result = {};
	if (propertyNames) {
		from(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) { result[propertyName] = obj[propertyName]; }
		});
	} else {
		assign(result, obj);
	}
	return result;
};

var bind                    = Function.prototype.bind
  , call$1                    = Function.prototype.call
  , keys$2                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

var _iterate = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(validValue(obj));
		validCallable(cb);

		list = keys$2(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") { method = list[method]; }
		return call$1.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) { return defVal; }
			return call$1.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

var forEach$1 = _iterate("forEach");

var call$2     = Function.prototype.call;

var map$1 = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	validCallable(cb);
	forEach$1(obj, function (value, key, targetObj, index) {
		result[key] = call$2.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};

var callable         = validCallable

  , bind$1 = Function.prototype.bind, defineProperty$3 = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) { return value; }
		desc.value = bind$1.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty$3(this, name, desc);
		return this[name];
	};
	return dgs;
};

var autoBind = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (options.resolveContext != null) { validCallable(options.resolveContext); }
	return map$1(props, function (desc, name) { return define(name, desc, options); });
};

var defineProperty$4 = Object.defineProperty, defineProperties$1 = Object.defineProperties, Iterator;

var es6Iterator = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) { throw new TypeError("Constructor requires 'new'"); }
	defineProperties$1(this, {
		__list__: d_1("w", validValue(list)),
		__context__: d_1("w", context),
		__nextIndex__: d_1("w", 0)
	});
	if (!context) { return; }
	validCallable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties$1(
	Iterator.prototype,
	assign(
		{
			_next: d_1(function () {
				var i;
				if (!this.__list__) { return undefined; }
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) { return i; }
				}
				if (this.__nextIndex__ < this.__list__.length) { return this.__nextIndex__++; }
				this._unBind();
				return undefined;
			}),
			next: d_1(function () {
				return this._createResult(this._next());
			}),
			_createResult: d_1(function (i) {
				if (i === undefined) { return { done: true, value: undefined }; }
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d_1(function (i) {
				return this.__list__[i];
			}),
			_unBind: d_1(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) { return; }
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d_1(function () {
				return "[object " + (this[es6Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d_1(function (index) {
				if (index >= this.__nextIndex__) { return; }
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty$4(this, "__redo__", d_1("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) { this.__redo__[i] = ++redo; }
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d_1(function (index) {
				var i;
				if (index >= this.__nextIndex__) { return; }
				--this.__nextIndex__;
				if (!this.__redo__) { return; }
				i = this.__redo__.indexOf(index);
				if (i !== -1) { this.__redo__.splice(i, 1); }
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) { this.__redo__[j] = --redo; }
				}, this);
			}),
			_onClear: d_1(function () {
				if (this.__redo__) { clear.call(this.__redo__); }
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty$4(
	Iterator.prototype,
	es6Symbol.iterator,
	d_1(function () {
		return this;
	})
);

var array = createCommonjsModule(function (module) {



var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) { throw new TypeError("Constructor requires 'new'"); }
	es6Iterator.call(this, arr);
	if (!kind) { kind = "value"; }
	else if (contains.call(kind, "key+value")) { kind = "key+value"; }
	else if (contains.call(kind, "key")) { kind = "key"; }
	else { kind = "value"; }
	defineProperty(this, "__kind__", d_1("", kind));
};
if (setPrototypeOf) { setPrototypeOf(ArrayIterator, es6Iterator); }

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(es6Iterator.prototype, {
	_resolve: d_1(function (i) {
		if (this.__kind__ === "value") { return this.__list__[i]; }
		if (this.__kind__ === "key+value") { return [i, this.__list__[i]]; }
		return i;
	})
});
defineProperty(ArrayIterator.prototype, es6Symbol.toStringTag, d_1("c", "Array Iterator"));
});

var string = createCommonjsModule(function (module) {



var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) { throw new TypeError("Constructor requires 'new'"); }
	str = String(str);
	es6Iterator.call(this, str);
	defineProperty(this, "__length__", d_1("", str.length));
};
if (setPrototypeOf) { setPrototypeOf(StringIterator, es6Iterator); }

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(es6Iterator.prototype, {
	_next: d_1(function () {
		if (!this.__list__) { return undefined; }
		if (this.__nextIndex__ < this.__length__) { return this.__nextIndex__++; }
		this._unBind();
		return undefined;
	}),
	_resolve: d_1(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) { return char; }
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) { return char + this.__list__[this.__nextIndex__++]; }
		return char;
	})
});
defineProperty(StringIterator.prototype, es6Symbol.toStringTag, d_1("c", "String Iterator"));
});

var iteratorSymbol$1 = es6Symbol.iterator
  , isArray$1        = Array.isArray;

var isIterable = function (value) {
	if (!isValue(value)) { return false; }
	if (isArray$1(value)) { return true; }
	if (isString(value)) { return true; }
	if (isArguments(value)) { return true; }
	return typeof value[iteratorSymbol$1] === "function";
};

var validIterable = function (value) {
	if (!isIterable(value)) { throw new TypeError(value + " is not iterable"); }
	return value;
};

var iteratorSymbol$2 = es6Symbol.iterator;

var get = function (obj) {
	if (typeof validIterable(obj)[iteratorSymbol$2] === "function") { return obj[iteratorSymbol$2](); }
	if (isArguments(obj)) { return new array(obj); }
	if (isString(obj)) { return new string(obj); }
	return new array(obj);
};

var isArray$2 = Array.isArray, call$3 = Function.prototype.call, some = Array.prototype.some;

var forOf = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray$2(iterable) || isArguments(iterable)) { mode = "array"; }
	else if (isString(iterable)) { mode = "string"; }
	else { iterable = get(iterable); }

	validCallable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call$3.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) { char += iterable[++i]; }
			}
			call$3.call(cb, thisArg, char, doBreak);
			if (broken) { break; }
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call$3.call(cb, thisArg, result.value, doBreak);
		if (broken) { return; }
		result = iterable.next();
	}
};

// Exports true if environment provides native `WeakMap` implementation, whatever that is.

var isNativeImplemented = (function () {
	if (typeof WeakMap !== 'function') { return false; }
	return (Object.prototype.toString.call(new WeakMap()) === '[object WeakMap]');
}());

var toStringTagSymbol = es6Symbol.toStringTag

  , isArray$3 = Array.isArray, defineProperty$5 = Object.defineProperty
  , hasOwnProperty$1 = Object.prototype.hasOwnProperty, getPrototypeOf$1 = Object.getPrototypeOf
  , WeakMapPoly;

var polyfill$1 = WeakMapPoly = function (/*iterable*/) {
	var iterable = arguments[0], self;
	if (!(this instanceof WeakMapPoly)) { throw new TypeError('Constructor requires \'new\''); }
	if (isNativeImplemented && setPrototypeOf && (WeakMap !== WeakMapPoly)) {
		self = setPrototypeOf(new WeakMap(), getPrototypeOf$1(this));
	} else {
		self = this;
	}
	if (iterable != null) {
		if (!isArray$3(iterable)) { iterable = get(iterable); }
	}
	defineProperty$5(self, '__weakMapData__', d_1('c', '$weakMap$' + randomUniq()));
	if (!iterable) { return self; }
	forOf(iterable, function (val) {
		validValue(val);
		self.set(val[0], val[1]);
	});
	return self;
};

if (isNativeImplemented) {
	if (setPrototypeOf) { setPrototypeOf(WeakMapPoly, WeakMap); }
	WeakMapPoly.prototype = Object.create(WeakMap.prototype, {
		constructor: d_1(WeakMapPoly)
	});
}

Object.defineProperties(WeakMapPoly.prototype, {
	delete: d_1(function (key) {
		if (hasOwnProperty$1.call(validObject(key), this.__weakMapData__)) {
			delete key[this.__weakMapData__];
			return true;
		}
		return false;
	}),
	get: d_1(function (key) {
		if (hasOwnProperty$1.call(validObject(key), this.__weakMapData__)) {
			return key[this.__weakMapData__];
		}
	}),
	has: d_1(function (key) {
		return hasOwnProperty$1.call(validObject(key), this.__weakMapData__);
	}),
	set: d_1(function (key, value) {
		defineProperty$5(validObject(key), this.__weakMapData__, d_1('c', value));
		return this;
	}),
	toString: d_1(function () { return '[object WeakMap]'; })
});
defineProperty$5(WeakMapPoly.prototype, toStringTagSymbol, d_1('c', 'WeakMap'));

var es6WeakMap = isImplemented() ? WeakMap : polyfill$1;

var top = typeof global !== 'undefined'
? global
: typeof self !== 'undefined'
? self
: window.top;

if(typeof top.__signal_record__ === 'undefined'){
    Object.defineProperty(top, '__signal_record__', {
        value: new es6WeakMap()
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

var SignalCollection = function SignalCollection(signals){
    this.signals = signals;
};
SignalCollection.prototype.remove = function remove (){
        var this$1 = this;

    for(var i=0; i<this.signals.length; i++){
        this$1.signals[i].remove();
    }
};

connect.init = function(obj, listeners, ctx){
    var keys = Object.keys(listeners);
    var signals = [];

    for(var i=0; i<keys.length; i++){
        signals.push(
            connect(obj, keys[i])
            .add(listeners[keys[i]], ctx)
        );
    }

    return new SignalCollection(signals);
};

exports.connect = connect;

return exports;

}({}));
//# sourceMappingURL=spellbind.js.map
