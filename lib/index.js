'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var id = 0;

function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}

function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }

  return receiver;
}

// Created and maintained by Kushuh.
// https://github.com/Kushuh - kuzanisu@gmail.com

/**
 * Shorthands for OS platforms.
 *
 * @type {{OTHER: string, LINUX: string, WINDOWS: string, MACOS: string, IOS: string, ANDROID: string}}
 */
var OS = {
  WINDOWS: 'Windows',
  LINUX: 'Linux',
  MACOS: 'MacOS',
  IOS: 'IOS',
  ANDROID: 'Android',
  OTHER: 'unknown'
};
/**
 * Return the operating system the current user is running on.
 *
 * @version 1.0.0
 * @author [Kushuh](https://github.com/Kushuh)
 * @return {string}
 */

var getOS = function getOS() {
  var userAgent = window.navigator.userAgent;
  var platform = window.navigator.platform; // Some platforms can have multiple identifiers.

  var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  var iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.includes(platform)) {
    return OS.MACOS;
  } else if (iosPlatforms.includes(platform)) {
    return OS.IOS;
  } else if (windowsPlatforms.includes(platform)) {
    return OS.WINDOWS;
  } else if (/Android/.test(userAgent)) {
    return OS.ANDROID;
  } else if (/Linux/.test(platform)) {
    return OS.LINUX;
  }

  return OS.OTHER;
};

var os = getOS();
/**
 * Ctrl for most OS, Cmd for macOS.
 * @type {string}
 */

var actionKey = os === OS.MACOS ? 'Meta' : 'Control';
/**
 * Common controls sequences.
 *
 * @type {{
 * 	UNDO: string[],
 * 	CUT: string[],
 * 	SELECTALL: string[],
 * 	PASTE: string[],
 * 	REDO: string[],
 * 	COPY: string[],
 * 	KONAMI_CODE: string[]
 * }}
 */

var COMBOS = {
  UNDO: [actionKey, 'Z'],
  REDO: [actionKey, 'Shift', 'Z'],
  SELECTALL: [actionKey, 'A'],
  COPY: [actionKey, 'C'],
  CUT: [actionKey, 'X'],
  PASTE: [actionKey, 'V'],
  KONAMI_CODE: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
};
/**
 * Attach a unique event to each instance of sequencer.
 *
 * @param {number} id
 * @return {string}
 * @override
 */

var event = function event(id) {
  return "KeySequenceUpdated_".concat(id);
};
/**
 * A Sequence consist of a callback and a list of keys to trigger it.
 *
 * @typedef {{fn: function, sequences: string[]}} Sequence
 * @override
 */

/**
 * Extend eventListener concept on a serie of keys.
 *
 * @version 1.0.0
 * @author [Kushuh](https://github.com/Kushuh)
 */


var _debug = _classPrivateFieldLooseKey("debug");

var _id = _classPrivateFieldLooseKey("id");

var _sequences = _classPrivateFieldLooseKey("sequences");

var _el = _classPrivateFieldLooseKey("el");

var _timeout = _classPrivateFieldLooseKey("timeout");

var _keyCount = _classPrivateFieldLooseKey("keyCount");

var _isSequenceValidated = _classPrivateFieldLooseKey("isSequenceValidated");

var _checkSequence = _classPrivateFieldLooseKey("checkSequence");

var Sequencer =
/**
 * @param {number=} timeout
 * @param {boolean=} debug
 * @constructs Sequencer
 */
function Sequencer(timeout, debug) {
  var _this = this;

  _classCallCheck(this, Sequencer);

  Object.defineProperty(this, _debug, {
    writable: true,
    value: void 0
  });
  Object.defineProperty(this, _id, {
    writable: true,
    value: void 0
  });
  Object.defineProperty(this, _sequences, {
    writable: true,
    value: []
  });
  Object.defineProperty(this, _el, {
    writable: true,
    value: void 0
  });
  Object.defineProperty(this, _timeout, {
    writable: true,
    value: void 0
  });
  Object.defineProperty(this, _keyCount, {
    writable: true,
    value: 0
  });

  this.mount = function (el) {
    // Assign element to the one passed in parameters
    _classPrivateFieldLooseBase(_this, _el)[_el] = el || document;

    if (_classPrivateFieldLooseBase(_this, _debug)[_debug]) {
      _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener(event(_classPrivateFieldLooseBase(_this, _id)[_id]), function () {
        console.log(_classPrivateFieldLooseBase(_this, _sequences)[_sequences]);
      });
    } // Return handlers in an object.


    return {
      /**
       * @param {KeyboardEvent} e
       */
      keyDown: function keyDown(e) {
        // Add a new key to current sequence and record its position.
        _classPrivateFieldLooseBase(_this, _keyCount)[_keyCount]++;

        _classPrivateFieldLooseBase(_this, _sequences)[_sequences].push(e.key);

        var lockKC = _classPrivateFieldLooseBase(_this, _keyCount)[_keyCount]; // Inform other listeners we updated the sequence.


        _classPrivateFieldLooseBase(_this, _el)[_el].dispatchEvent(new CustomEvent(event(_classPrivateFieldLooseBase(_this, _id)[_id]), {
          detail: e
        })); // Remove listener declared as a variable so it can be removed.

        /**
         * @param {KeyboardEvent} ee
         */


        var removeKey = function removeKey(ee) {
          // Callback when the key needs to be removed from current sequence.
          var terminateCallback = function terminateCallback() {
            // Current offset of the key.
            var offset = _classPrivateFieldLooseBase(_this, _keyCount)[_keyCount] - lockKC; // Only if key is still present in the sequences array.

            if (offset < _classPrivateFieldLooseBase(_this, _sequences)[_sequences].length) {
              // Remove current key and every key before it.
              _classPrivateFieldLooseBase(_this, _sequences)[_sequences] = _classPrivateFieldLooseBase(_this, _sequences)[_sequences].slice(_classPrivateFieldLooseBase(_this, _sequences)[_sequences].length - offset + 1);
            } // Remove attached listeners for the current key.


            _classPrivateFieldLooseBase(_this, _el)[_el].removeEventListener('keyup', removeKey, true);

            _classPrivateFieldLooseBase(_this, _el)[_el].removeEventListener('keydown', resetCallback, true);
          }; // Reset timer when another key is pressed fast enough, allowing for longer combos.


          var resetCallback = function resetCallback() {
            clearTimeout(timer);
            timer = setTimeout(terminateCallback, _classPrivateFieldLooseBase(_this, _timeout)[_timeout]);
          };

          var timer = setTimeout(terminateCallback, _classPrivateFieldLooseBase(_this, _timeout)[_timeout]);

          _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener('keydown', resetCallback, true);
        }; // Add listener in a way it can be removed afterwards.


        _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener('keyup', removeKey, true);
      }
    };
  };

  this.listen = function (el) {
    // Get handlers and set them.
    var _this$mount = _this.mount(el),
        keyDown = _this$mount.keyDown;

    _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener('keydown', keyDown); // So it can be used in ref={} declaration.


    return el;
  };

  this.dynamicKeys = function (accessor) {
    if (_classPrivateFieldLooseBase(_this, _el)[_el] == null) {
      throw new Error('sequencer is not yet initialized, you cannot attach listeners to it');
    }

    _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener(event(_classPrivateFieldLooseBase(_this, _id)[_id]), function (e) {
      (accessor() || []).forEach(function (registration) {
        return _classPrivateFieldLooseBase(_this, _checkSequence)[_checkSequence](e.detail, registration);
      });
    });
  };

  this.setDebugMode = function (mode) {
    _classPrivateFieldLooseBase(_this, _debug)[_debug] = mode;
  };

  this.getSequence = function () {
    return _classPrivateFieldLooseBase(_this, _sequences)[_sequences];
  };

  this.getValidationStatus = function (keys) {
    var i = keys.length;

    while (keys.slice(0, i).join(';') !== _classPrivateFieldLooseBase(_this, _sequences)[_sequences].slice(-i).join(';') && i > 0) {
      i--;
    }

    return i;
  };

  Object.defineProperty(this, _isSequenceValidated, {
    writable: true,
    value: function value(target, current) {
      return current.endsWith(target);
    }
  });
  Object.defineProperty(this, _checkSequence, {
    writable: true,
    value: function value(e, registration) {
      if (_classPrivateFieldLooseBase(_this, _isSequenceValidated)[_isSequenceValidated](registration.sequence.join(' '), _classPrivateFieldLooseBase(_this, _sequences)[_sequences].join(' '))) {
        if (_classPrivateFieldLooseBase(_this, _debug)[_debug]) {
          console.log("running ".concat(registration.fn.name));
        }

        registration.fn(e);
      } else if (registration.fallback) {
        if (_classPrivateFieldLooseBase(_this, _debug)[_debug]) {
          console.log("running ".concat(registration.fallback.name));
        }

        registration.fallback(e);
      }
    }
  });

  this.register = function (sequence, fn, fallback) {
    if (_classPrivateFieldLooseBase(_this, _el)[_el] == null) {
      throw new Error('sequencer is not yet initialized, you cannot attach listeners to it');
    }

    _classPrivateFieldLooseBase(_this, _el)[_el].addEventListener(event(_classPrivateFieldLooseBase(_this, _id)[_id]), function (e) {
      return _classPrivateFieldLooseBase(_this, _checkSequence)[_checkSequence](e.detail, {
        fn: fn,
        sequence: sequence,
        fallback: fallback
      });
    });
  };

  _classPrivateFieldLooseBase(this, _debug)[_debug] = debug;
  _classPrivateFieldLooseBase(this, _timeout)[_timeout] = timeout || 400;
  _classPrivateFieldLooseBase(this, _id)[_id] = new Date().getTime();
}
/**
 * Debug mode allow to print dynamically recorded sequence.
 *
 * @type {boolean}
 * @private
 */
;

// Created and maintained by Kushuh - kuzanisu@gmail.com.
// https://github.com/Kushuh

/**
 * This file contains helpers for manipulating carets in a DOM document.
 *
 * EXPORTED
 * - getSelectionRange
 * - setSelectionRange
 *
 * UTILS
 * - getComplexOffset
 * - seekSelectionNode
 */

/**
 * Represent a caret range within a rendered string. Caret goes from content[start] to content[end].
 *
 * @typedef {{start: number, end: number}} Caret
 */

/**
 * Calculate offset while ignoring some elements based on an array of selectors.
 *
 * @param {Range} range - current document range
 * @param {Node} container - the container wrapping the selection
 * @param {number} offset - the targeted position for the caret
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @returns {number}
 */
var getComplexOffset = function getComplexOffset(range, container, offset, ignore) {
  if (ignore == null || ignore.length === 0) {
    return offset;
  } // Select content from 0 to offset. This allow us to count every static content occurring before our caret position,
  // which are likely to alter it.


  range.setEnd(container, offset);
  var copy = range.cloneContents();

  var _iterator = _createForOfIteratorHelper(ignore),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var selector = _step.value;
      copy.querySelectorAll(selector).forEach(function (e) {
        return e ? e.innerHTML = '' : '';
      });
    } // Remove static length from caret position.

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return copy.innerText.length;
};
/**
 * From an absolute caret position, find it's "relative" position (aka the one we should expect to be returned from
 * DOM methods). Range needs a container and an offset. The container has to be a text node, and the offset be contained
 * within it.
 *
 * @param {number} target - the target position for the cursor
 * @param {Node} el - the parent element of the cursor (not necessarily direct)
 * @param {string[]=} ignore - ignore some elements when calculating caret
 * @returns {{container: Node, offset: number}}
 */


var seekSelectionNode = function seekSelectionNode(target, el, ignore) {
  // Container is already a text node, so absolute position will equal the relative one and we don't need to do
  // anything.
  if (el.nodeType === Node.TEXT_NODE) {
    // In case the target (offset) is longer than the content length, setting range will throw an error. We'd like to
    // avoid this, so if target is greater than the text length, we cap it.
    return {
      container: el,
      offset: Math.min(target,
      /** @type Node.TEXT_NODE */
      el.length)
    };
  } // Empty node means we have nothing to select.


  if (el.childNodes == null) {
    return {
      container: el,
      offset: 0
    };
  } // Loop through child nodes while summing length of their content. Our container will be the first node to exceed the
  // offset position.


  var offset = 0;

  var nodes = _toConsumableArray(el.childNodes);

  var _iterator2 = _createForOfIteratorHelper(nodes),
      _step2;

  try {
    var _loop = function _loop() {
      var node = _step2.value;

      // Ignore static content.
      if (ignore != null && ignore.length > 0 && node.classList && ignore.find(function (x) {
        return node.matches(x);
      })) {
        return "continue";
      } // Text nodes work differently from classic nodes, since they don't have innerText property.


      var innerLength = node.nodeType === Node.TEXT_NODE ? node.length : (node.innerText || '').length;
      offset += innerLength; // Perform recursive check because we eventually need our container to be a text node.

      if (offset > target) {
        return {
          v: seekSelectionNode(target - offset + innerLength, node)
        };
      }
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
      if (_typeof(_ret) === "object") return _ret.v;
    } // Since we should return if a Node was found, it means our caret is currently out of bounds. We set the caret at the
    // very end then.

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var last = nodes.pop();

  while (last && last.nodeType !== Node.TEXT_NODE && last.childNodes && last.childNodes.length) {
    last = _toConsumableArray(last.childNodes).pop();
  }

  return {
    container: last,
    offset: (last || '').length
  };
};
/**
 * Return information about caret position. Return object contain data returned by default range handlers (caret parent
 * element and offset within the given parent), plus an absolute range. Absolute range (which consist of a start and
 * end offset) returns the caret boundaries if element had only one pure text child node.
 *
 * @param {Node} element
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @returns {{absolute: Caret, start: {container: Node, offset: number}, end: {container: Node, offset: number}}}
 */


var getSelectionRange = function getSelectionRange(element, ignore) {
  // Allocate variables for better readability.
  var start = 0;
  var end = 0;
  var startContainer = element;
  var endContainer = element;
  var startOffset = 0;
  var endOffset = 0; // Secure way to get the equivalent of 'window' global in non DOM environment, which can be useful for testing, for
  // example. It is more generally safer to avoid relying too much on globals.

  var win = (element.ownerDocument || document).defaultView; // Check if something is selected (pointless otherwise).

  var sel = win.getSelection();

  if (sel.rangeCount > 0) {
    // TODO : would be useful to look further at how selection work; can a document hold multiple selection ranges ?
    // TODO : How do we deal with them ?
    var range = win.getSelection().getRangeAt(0); // Creating a copy of range allows to compute it while not interfering with the actual selection. We need such
    // alterations in the getComplexOffset() method.

    var preCaretRange = range.cloneRange(); // Default variable provided by js DOM.

    startContainer = range.startContainer;
    endContainer = range.endContainer;
    startOffset = range.startOffset;
    endOffset = range.endOffset; // Select the whole content under our element.

    preCaretRange.selectNodeContents(element); // Read more about this function goal at the function doc above. This will set our absolute caret position.

    start = getComplexOffset(preCaretRange, range.startContainer, range.startOffset, ignore);
    end = getComplexOffset(preCaretRange, range.endContainer, range.endOffset, ignore);
  } // Return object. Default records are set at declaration, in case no selection was found within the element.


  return {
    absolute: {
      start: start,
      end: end
    },
    start: {
      container: startContainer,
      offset: startOffset
    },
    end: {
      container: endContainer,
      offset: endOffset
    }
  };
};
/**
 * Set caret to given range. Additionally to wrap the default javascript methods to achieve this, it works with
 * absolute caret position and static content.
 *
 * @param {Node} element
 * @param {number} start
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @param {number} end
 * @return {*}
 */


var setSelectionRange = function setSelectionRange(element, start, end, ignore) {
  debugger; // No need to do anything if no content is present.

  if (element.innerText == null || element.innerText.length === 0) {
    return {
      start: -1,
      end: -1,
      it: element.outerHTML
    };
  } // Secure way to get the equivalent of 'window' global in non DOM environment, which can be useful for testing, for
  // example. It is more generally safer to avoid relying too much on globals.


  var win = (element.ownerDocument || document).defaultView; // Cap caret position to avoid overflow error.

  start = Math.min(element.innerText.length, start);
  end = Math.min(element.innerText.length, end || start);
  var range = (element.ownerDocument || document).createRange(); // Get relative position of the node.

  var _seekSelectionNode = seekSelectionNode(start, element, ignore),
      startNode = _seekSelectionNode.container,
      startOffset = _seekSelectionNode.offset;

  var _seekSelectionNode2 = seekSelectionNode(end, element, ignore),
      endNode = _seekSelectionNode2.container,
      endOffset = _seekSelectionNode2.offset;

  range.setStart(startNode || element, startOffset);
  range.setEnd(endNode || element, endOffset);
  var sel = win.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  return {
    start: start,
    end: end,
    it2: element.innerText
  };
};

var literals = {
  OS: OS,
  COMBOS: COMBOS
};

exports.Sequencer = Sequencer;
exports.getOS = getOS;
exports.getRange = getSelectionRange;
exports.literals = literals;
exports.setRange = setSelectionRange;
