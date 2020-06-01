/* eslint-disable */

const TYPE_KEYNAME = typeof Symbol === 'function' ? Symbol('--[[await-event-emitter]]--') : '--[[await-event-emitter]]--';

function isPromise(obj) {
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function assertType(type) {
	if (typeof type !== 'string' && typeof type !== 'symbol') {
		throw new TypeError('type is not type of string or symbol!');
	}
}

function assertFn(fn) {
	if (typeof fn !== 'function') {
		throw new TypeError('fn is not type of Function!');
	}
}

function alwaysListener(fn) {
	return {
		[TYPE_KEYNAME]: 'always',
		fn,
	};
}
function onceListener(fn) {
	return {
		[TYPE_KEYNAME]: 'once',
		fn,
	};
}

function AwaitEventEmitter() {
	this._events = {};
}

function on(type, fn) {
	assertType(type);
	assertFn(fn);
	this._events[type] = this._events[type] || [];
	this._events[type].push(alwaysListener(fn));
	return this;
}

function prepend(type, fn) {
	assertType(type);
	assertFn(fn);
	this._events[type] = this._events[type] || [];
	this._events[type].unshift(alwaysListener(fn));
	return this;
}

function prependOnce(type, fn) {
	assertType(type);
	assertFn(fn);
	this._events[type] = this._events[type] || [];
	this._events[type].unshift(onceListener(fn));
	return this;
}

function listeners(type) {
	return (this._events[type] || []).map((x) => x.fn);
}

function once(type, fn) {
	assertType(type);
	assertFn(fn);
	this._events[type] = this._events[type] || [];
	this._events[type].push(onceListener(fn));
	return this;
}

function removeListener(type, nullOrFn) {
	assertType(type);

	const listeners = this.listeners(type);
	if (typeof nullOrFn === 'function') {
		let index;
		let found = false;
		while ((index = listeners.indexOf(nullOrFn)) >= 0) {
			listeners.splice(index, 1);
			this._events[type].splice(index, 1);
			found = true;
		}
		return found;
	}
	return delete this._events[type];

}

function removeAllListeners() {
	Object.keys(this._events).forEach((eventType) => delete this._events[eventType]);

	return true;
}

async function emit(type, ...args) {
	assertType(type);
	const listeners = this.listeners(type);

	const onceListeners = [];
	if (listeners && listeners.length) {
		for (let i = 0; i < listeners.length; i++) {
			const event = listeners[i];

			try {
				const rlt = event.apply(this, args);

				if (isPromise(rlt)) {
					await rlt;
				}

				if (this._events[type][i][TYPE_KEYNAME] === 'once') {
					onceListeners.push(event);
				}
			} catch (e) {
				if (e.message === 'can\'t access dead object') {
					this.removeListener(type, event);
				}
			}
		}
		onceListeners.forEach((event) => this.removeListener(type, event));

		return true;
	}
	return false;
}

AwaitEventEmitter.prototype.on = AwaitEventEmitter.prototype.addListener = on;
AwaitEventEmitter.prototype.once = once;
AwaitEventEmitter.prototype.prependListener = prepend;
AwaitEventEmitter.prototype.prependOnceListener = prependOnce;
AwaitEventEmitter.prototype.off = AwaitEventEmitter.prototype.removeListener = removeListener;
AwaitEventEmitter.prototype.removeAllListeners = removeAllListeners;
AwaitEventEmitter.prototype.emit = emit;
AwaitEventEmitter.prototype.listeners = listeners;

export default AwaitEventEmitter;
