// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"718bc53c07dfaad6fb25450ab93e9b92":[function(require,module,exports) {
"use strict";

var _dates = require("../fb/dates");

var _log = require("./log");

/*
 This file is used to inject globals on webpages,
 so it needs to be bundled before use.
 If you change this file, make sure to rebuild it using
`npm run bundle-browser-globals`
*/

/* eslint-env browser */
let __ = {
  Log: _log.Log,
  parseHumanDate: _dates.parseHumanDate,
  $: function (selector, startNode) {
    return window.document.querySelector(selector, startNode);
  },
  $$: function (selector, startNode) {
    return Array.from(window.document.querySelectorAll(selector, startNode));
  }
};
window.__ = __;
},{"../fb/dates":"9a982923b93f4596ff426c79555791f8","./log":"2728623b0d739e1a925fdffdc80537cf"}],"9a982923b93f4596ff426c79555791f8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHumanDate = parseHumanDate;

var _dateFns = require("date-fns");

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const formats = [[/just now/i, (str, match, ref) => ref], [/(\d+)\smins?/i, (str, match, ref) => (0, _dateFns.sub)(ref, {
  minutes: match[1]
})], [/(\d+)\shrs?/i, (str, match, ref) => (0, _dateFns.sub)(ref, {
  hours: match[1]
})], [/on\s(\w+)/i, (str, match, ref) => {
  let targetDay = weekDays.findIndex(day => day.startsWith(match[1].toLowerCase()));
  let today = (0, _dateFns.getDay)(ref);
  let absDelta = Math.abs(today - targetDay);
  let delta = targetDay >= today ? 7 - absDelta : absDelta;
  return (0, _dateFns.subDays)(ref, delta);
}], [/yesterday\sat\s(\d+):(\d+)\s(am|pm)/i, (str, match, ref) => (0, _dateFns.parse)(str.toLowerCase(), '\'yesterday at \'h:mm aa', (0, _dateFns.subDays)(ref, 1))], [// December 21 at 4:24 PM
/(\w)\s(\d+)\sat\s(\d+):(\d+)\s(am|pm)/i, 'MMMM d \'at\' h:mm aa'], [// December 16, 2018 at 4:24 PM
/(\w)\s(\d+),\s(\d+)\sat\s(\d+):(\d+)\s(am|pm)/i, 'MMMM d, y \'at\' h:mm aa']];

function parseHumanDate(str, referenceDate = new Date()) {
  let date = null;
  formats.find(([regex, resolver]) => {
    let match = str.match(regex);

    if (match) {
      let ref = new Date(referenceDate); // let ref = referenceDate

      if (typeof resolver === 'function') {
        date = resolver(str, match, ref);
      } else if (typeof resolver === 'string') {
        date = (0, _dateFns.parse)(str, resolver, ref);
      } else {
        throw new Error(`parseHumanDate: resolver missing for ${regex}`);
      }

      return true;
    }
  });
  return date;
}
},{}],"2728623b0d739e1a925fdffdc80537cf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = Log;

function Log(contextFnName = '') {
  return (...args) => {
    const label = contextFnName ? contextFnName + ':' : '';
    globalThis.console.log(label, ...args);
  };
}
},{}]},{},["718bc53c07dfaad6fb25450ab93e9b92"], null)

//# sourceMappingURL=browser-globals.js.map
