/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

class TunerC extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    // tuner;
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { id: "hz" }, "hz = "),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { id: "note" }, "note = "),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("canvas", { id: "wave" }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TunerC;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__note__ = __webpack_require__(7);

class TunerView {
    constructor() {
        // this.canvas = null;
        // this.canvasContext = null;
        this.canvas = document.getElementById("wave");
        this.canvasContext = this.canvas.getContext("2d");
        this.hzElement = document.getElementById("hz");
        this.noteElement = document.getElementById("note");
    }
    setPixel(imageData, x, y, color) {
        const width = imageData.width;
        const data = imageData.data;
        const index = ((width * y) + x) * 4;
        if (!isNaN(color.r)) {
            data[index] = color.r;
        }
        if (!isNaN(color.g)) {
            data[index + 1] = color.g;
        }
        if (!isNaN(color.b)) {
            data[index + 2] = color.b;
        }
        if (!isNaN(color.a)) {
            return data[index + 3] = color.a;
        }
    }
    drawWave(buffer, note) {
        let x, y;
        this.canvasContext.save();
        this.canvasContext.fillStyle = "rgb(30, 30, 30)";
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.restore();
        const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const color = {
            r: 200,
            g: 200,
            b: 200,
            a: 255
        };
        const red = {
            r: 200,
            g: 0,
            b: 0,
            a: 255
        };
        const width = imageData.width;
        const height = imageData.height;
        for (let x = 0; x < width; x++) {
            y = Math.floor(height / 2 + buffer[x * 2] * height);
            this.setPixel(imageData, x, y, color);
        }
        x = Math.round(width / 2 + width * note.diff());
        for (let y = 0; y < height; y++) {
            this.setPixel(imageData, x, y, color);
            this.setPixel(imageData, width / 2, y, red);
        }
        this.canvasContext.putImageData(imageData, 0, 0);
    }
    ;
    setText(hz, note) {
        this.hzElement.innerHTML = 'hz = ' + hz;
        this.noteElement.innerHTML = 'note = ' + note.name();
    }
    draw(wave, hz) {
        const note = new __WEBPACK_IMPORTED_MODULE_0__note__["a" /* default */](hz);
        this.drawWave(wave, note);
        if (hz < 30) {
            return;
        }
        this.setText(hz, note);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TunerView;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_PeerJs__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__communicator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tuner__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_TunerC__ = __webpack_require__(2);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const APIKEY = 'c86fbf19-fbee-4b25-80ea-02b27155ec51';
function wait(n) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(r => setTimeout(r, n));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const m = location.href.match(/#(\w+)/);
        const communicator = new __WEBPACK_IMPORTED_MODULE_3__communicator__["a" /* Communicator */](APIKEY);
        console.log(m);
        if (m) {
            yield communicator.prepare();
            __WEBPACK_IMPORTED_MODULE_1_react_dom__["render"](__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__components_PeerJs__["a" /* PeerJs */], { communicator: communicator }), document.getElementById("main"));
        }
        else {
            __WEBPACK_IMPORTED_MODULE_1_react_dom__["render"](__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__components_TunerC__["a" /* TunerC */], { communicator: communicator }), document.getElementById("main"));
            const tuner = new __WEBPACK_IMPORTED_MODULE_4__tuner__["a" /* Tuner */]();
            tuner.main();
            yield communicator.prepare();
            communicator.on("accept", e => {
                console.log("accept");
                tuner.onData = hz => {
                    communicator.send(hz);
                };
            });
        }
    });
}
window.onload = () => main().then();


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_events__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TunerC__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tunerView__ = __webpack_require__(3);




class Log extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            "log:",
            this.props.contents.map((e, i) => __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { key: i }, e)));
    }
}
class Peer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    onClick(e) {
        e.stopPropagation();
        this.props.emitter.emit("connecting", { source: this, data: this.props.peer });
    }
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: this.onClick.bind(this) }, this.props.peer));
    }
}
class Peers extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            "peers:",
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, this.props.peers.map((e) => __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Peer, { emitter: this.props.emitter, key: e, peer: e }))));
    }
}
class PeerJs extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    log(text) {
        this.state.logs.push(text);
        this.setState({ logs: this.state.logs });
    }
    constructor(props) {
        super(props);
        this.emitter = new __WEBPACK_IMPORTED_MODULE_1_events__["EventEmitter"]();
        this.state = { peers: [], logs: ["init"] };
        props.communicator.allPeers().then(e => {
            this.emitter.emit("peers", { source: this, data: e });
        });
        props.communicator.on("accept", e => {
            this.tunerView = new __WEBPACK_IMPORTED_MODULE_3__tunerView__["a" /* TunerView */]();
            this.log("accept");
        });
        props.communicator.on("recieve", e => {
            this.tunerView.draw([], e.data);
        });
        this.emitter.on("peers", e => {
            this.setState({ peers: e.data });
        });
        this.emitter.on("connecting", e => {
            props.communicator.connect(e.data);
        });
    }
    send(e) {
        e.stopPropagation();
        this.props.communicator.send("h");
    }
    allPeers(e) {
        e.stopPropagation();
        this.props.communicator.allPeers().then(e => {
            this.emitter.emit("peers", { source: this, data: e });
        });
    }
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
                "myId: ",
                this.props.communicator.peerId),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("button", { onClick: this.send.bind(this) }, "send"),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("button", { onClick: this.allPeers.bind(this) }, "allPeers"),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Peers, { emitter: this.emitter, peers: this.state.peers }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__TunerC__["a" /* TunerC */], { communicator: this.props.communicator }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Log, { contents: this.state.logs }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PeerJs;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Note {
    constructor(hz) {
        this.hz = hz;
        this.base = 55;
        this.note = Math.log(this.hz / this.base) / Math.log(2) * 12;
    }
    name() {
        const names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
        const note12 = (this.note >= 0) ? this.note % 12 : this.note % 12 + 12;
        var i = Math.floor((note12 + 0.5) % 12);
        return names[i];
    }
    diff() {
        return (this.note + 0.5) % 1 - 0.5;
    }
}
/* harmony default export */ __webpack_exports__["a"] = (Note);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_skyway_peerjs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_skyway_peerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_skyway_peerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_events__);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class Transmitter {
    constructor(conn) {
        this.conn = conn;
    }
    send(data) {
        this.conn.send(data);
    }
}
class Reciever {
    constructor(conn, emitter) {
        this.conn = conn;
        this.emitter = emitter;
        this.conn.on('data', (data) => {
            this.emitter.emit('recieve', { source: this, data: data });
        });
        this.conn.on('error', (e) => {
            console.log(e);
        });
    }
}
class Communicator {
    constructor(apikey) {
        this.peer = new __WEBPACK_IMPORTED_MODULE_0_skyway_peerjs___default.a({ key: apikey });
        this.recievers = new Map();
        this.transmitters = new Map();
        this.emitter = new __WEBPACK_IMPORTED_MODULE_1_events__["EventEmitter"];
        this.peer.on('connection', (conn) => {
            console.log("con");
            this.accept(conn);
            this.emitter.emit("accept", { source: this, data: conn });
        });
        this.peer.on('error', (e) => {
            console.log(e);
        });
    }
    allPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield new Promise(r => this.peer.listAllPeers(r));
            const a = list;
            return a.filter(e => e != this.peerId);
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield new Promise(r => this.peer.on('open', r));
            this.peerId = id;
        });
    }
    connect(destId) {
        if (!this.transmitters.get(destId)) {
            const conn = this.peer.connect(destId);
            this.transmitters.set(destId, new Transmitter(conn));
        }
    }
    accept(conn) {
        const destId = conn.peer;
        if (!this.recievers.get(destId)) {
            this.connect(destId);
            const reciever = new Reciever(conn, this.emitter);
            this.recievers.set(destId, reciever);
        }
    }
    send(message) {
        for (const t of this.transmitters.values()) {
            t.send(message);
        }
    }
    on(type, handler) {
        this.emitter.on(type, handler);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Communicator;



/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = Peer;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pitcher__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tunerView__ = __webpack_require__(3);


class Tuner {
    constructor() {
        this.audioContext = null;
        this.onData = null;
        this.view = new __WEBPACK_IMPORTED_MODULE_1__tunerView__["a" /* TunerView */]();
    }
    connectRecorder(stream) {
        this.audioContext = new AudioContext();
        const bufferSize = 2048;
        const recorder = this.audioContext.createScriptProcessor(bufferSize, 2, 2);
        let counter = 0;
        recorder.onaudioprocess = (e) => {
            const span = document.hasFocus() ? 2 : 20;
            if (counter++ % span != 0) {
                return;
            }
            const left = e.inputBuffer.getChannelData(0);
            const hz = __WEBPACK_IMPORTED_MODULE_0__pitcher__["a" /* default */].pitch(left, this.audioContext.sampleRate);
            if (this.onData) {
                this.onData(hz);
            }
            this.view.draw(left, hz);
        };
        const input = this.audioContext.createMediaStreamSource(stream);
        input.connect(recorder);
        return recorder.connect(this.audioContext.destination);
    }
    main() {
        const nav = navigator;
        const win = window;
        if (!nav.getUserMedia) {
            nav.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
        }
        if (!win.AudioContext) {
            win.AudioContext = win.webkitAudioContext;
        }
        if (!nav.getUserMedia || !win.AudioContext) {
            alert("not supported in this browser.");
            return;
        }
        nav.getUserMedia({ audio: true }, this.connectRecorder.bind(this), () => { alert("error capturing audio."); });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tuner;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__complex__ = __webpack_require__(12);

class Pitcher {
    static parabola(nsdf, i) {
        const a = nsdf[i - 1];
        const b = nsdf[i];
        const c = nsdf[i + 1];
        const bottom = a + c - 2.0 * b;
        let x, y;
        if (bottom === 0.0) {
            x = i;
            y = b;
        }
        else {
            const delta = a - c;
            x = i + delta / (2.0 * bottom);
            y = b - delta * delta / (8.0 * bottom);
        }
        return { x: x, y: y };
    }
    static acf(x) {
        const n = x.length;
        const tmp = new Array();
        for (let i = 0; i < n; i++) {
            tmp[i] = x[i];
        }
        for (let i = n; i < (n * 2); i++) {
            tmp[i] = new __WEBPACK_IMPORTED_MODULE_0__complex__["a" /* default */](0, 0);
        }
        FFT.fft(tmp, n * 2);
        for (let i = 0; i < (n * 2); i++) {
            tmp[i] = tmp[i].abs2();
        }
        FFT.fft(tmp, n * 2);
        const out = new Array();
        for (let i = 0; i < n; i++) {
            out[i] = tmp[i].real / n / 2;
        }
        return out;
    }
    static nsdf(x) {
        const n = x.length;
        const out = this.acf(x);
        let tsq = out[0] * 2.0;
        for (let i = 0; i < n; i++) {
            out[i] = tsq > 0.0 ? out[i] / tsq : 0.0;
            tsq -= Math.pow(x[n - 1 - i].real, 2) + Math.pow(x[i].real, 2);
        }
        return out;
    }
    static peakPicking(nsdf) {
        let head = 0;
        const peakIndexes = new Array();
        const n = nsdf.length - 1;
        let i = 0;
        for (; i < n && nsdf[i] > 0; i++) {
            // nop
        }
        for (; i < n; i++) {
            const pi = peakIndexes[head];
            if (nsdf[i] > 0) {
                if (pi === undefined || nsdf[i] > nsdf[pi]) {
                    peakIndexes[head] = i;
                }
            }
            else if (pi !== undefined) {
                head += 1;
            }
        }
        return peakIndexes;
    }
    static pitch(ary, sampleRate) {
        const DEFAULT_CUTOFF = 0.95;
        const x = new Array();
        for (let i = 0; i < ary.length; i++)
            x[i] = new __WEBPACK_IMPORTED_MODULE_0__complex__["a" /* default */](ary[i], 0);
        const nsdf = this.nsdf(x);
        const peakIndexes = this.peakPicking(nsdf);
        if (peakIndexes.length === 0)
            return -1.0;
        const periods = new Array();
        const amps = new Array();
        let maxAmp = 0;
        for (let i = 0; i < peakIndexes.length; i++) {
            const h = this.parabola(nsdf, peakIndexes[i]);
            maxAmp = Math.max(maxAmp, h.y);
            amps.push(h.y);
            periods.push(h.x);
        }
        if (maxAmp < 0.35)
            return -1.0;
        let idx = amps.findIndex(e => e > DEFAULT_CUTOFF * maxAmp);
        if (idx === -1)
            return -1.0;
        return sampleRate / periods[idx];
    }
}
class FFT {
    static fft_inner(n, stride, copy_flag, x, y) {
        if (n <= 1) {
            for (let q = 0; copy_flag && q < stride; q++) {
                y[q] = x[q];
            }
            return;
        }
        const m = Math.floor(n / 2);
        const theta = 2.0 * Math.PI / n;
        for (let p = 0; p < m; p++) {
            const wp = new __WEBPACK_IMPORTED_MODULE_0__complex__["a" /* default */](Math.cos(p * theta), -Math.sin(p * theta));
            for (let q = 0; q < stride; q++) {
                const a = x[q + stride * p];
                const b = x[q + stride * (p + m)];
                y[q + stride * (2 * p + 0)] = a.plus(b);
                y[q + stride * (2 * p + 1)] = a.minus_bang(b).multi(wp);
            }
        }
        FFT.fft_inner(m, 2 * stride, !copy_flag, y, x);
    }
    static fft(x, n) {
        FFT.fft_inner(n, 1, false, x, new Array());
    }
}
/* harmony default export */ __webpack_exports__["a"] = (Pitcher);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Complex {
    constructor(r, i) {
        this.real = r;
        this.imag = i;
    }
    multi_f(f) {
        return new Complex(this.real * f, this.imag * f);
    }
    multi_f_bang(f) {
        this.real *= f;
        this.imag *= f;
        return this;
    }
    multi(c) {
        return new Complex(this.real * c.real - this.imag * c.imag, this.real * c.imag + this.imag * c.real);
    }
    multi_bang(c) {
        this.real = this.real * c.real - this.imag * c.imag;
        this.imag = this.real * c.imag + this.imag * c.real;
        return this;
    }
    minus(c) {
        return new Complex(this.real - c.real, this.imag - c.imag);
    }
    minus_bang(c) {
        this.real -= c.real;
        this.imag -= c.imag;
        return this;
    }
    plus(c) {
        return new Complex(this.real + c.real, this.imag + c.imag);
    }
    plus_bang(c) {
        this.real += c.real;
        this.imag += c.imag;
        return this;
    }
    exp() {
        var expreal = Math.exp(this.real);
        return new Complex(expreal * Math.cos(this.imag), expreal * Math.sin(this.imag));
    }
    exp_bang() {
        var expreal = Math.exp(this.real);
        this.real = expreal * Math.cos(this.imag);
        this.imag = expreal * Math.sin(this.imag);
        return this;
    }
    abs2() {
        return new Complex(this.real * this.real + this.imag * this.imag, 0);
    }
}
/* harmony default export */ __webpack_exports__["a"] = (Complex);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map