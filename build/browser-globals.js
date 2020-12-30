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
})({"ae279a62d6699cbcfbcb300b7dac0546":[function(require,module,exports) {
"use strict";

var _log = require("./log");

var _selectors = require("../fb/selectors");

/* eslint-env browser */
let __ = {
  Log: _log.Log,
  SELECTORS: _selectors.SELECTORS,
  $: function (selector, startNode) {
    return window.document.querySelector(selector, startNode);
  },
  $$: function (selector, startNode) {
    return Array.from(window.document.querySelectorAll(selector, startNode));
  }
};
window.__ = __;
},{"./log":"2a89955314a5bf5f07500ea96066b21c","../fb/selectors":"9afa8797f45501d3b745d59e03a49023"}],"2a89955314a5bf5f07500ea96066b21c":[function(require,module,exports) {
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
},{}],"9afa8797f45501d3b745d59e03a49023":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SELECTORS = void 0;
const SELECTORS = {
  login: '#email',
  pass: '#pass',
  twoFactorCodeInput: '#approvals_code',
  checkpointSubmit: '#checkpointSubmitButton',
  postsContainer: '.storyStream',
  feedPost: '.storyStream > article',
  // [data-sigil="m-story-view"]
  reactionsMetaContainer: '[data-sigil="reactions-bling-bar"]',
  hasRepost: '[data-sigil="feed-ufi-metadata"]',
  feedLoadingIndicator: '.storyStream [role="progressbar"][aria-busy="true"]',
  // single post
  postRoot: '[data-sigil="m-story-view"]',
  postLink: '[data-sigil="feed-ufi-trigger"]',
  postTime: '[data-sigil="m-feed-voice-subtitle"] abbr',
  postShares: '[data-sigil="feed-ufi-sharers"]',
  postReactions: 'a[href*="ufi/reaction"]',
  postCommentsRoot: '[data-sigil="m-mentions-expand"]',
  postComment: '[data-sigil="comment"]',
  postCommentBody: '[data-sigil="comment-body"]',
  postMoreLink: '[data-sigil="more"]'
};
exports.SELECTORS = SELECTORS;
},{}]},{},["ae279a62d6699cbcfbcb300b7dac0546"], null)

//# sourceMappingURL=browser-globals.js.map
