'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory();
	} else {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
})(function () {
	function extend() {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[i];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init(converter) {
		function api(key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return document.cookie = [key, '=', value, attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
				attributes.path && '; path=' + attributes.path, attributes.domain && '; domain=' + attributes.domain, attributes.secure ? '; secure' : ''].join('');
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api(key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
});
"use strict";

document.addEventListener("DOMContentLoaded", function (event) {

  var hook = document.getElementById("reactions");

  if (hook.length < 1) return;

  hook.innerHTML = Reactions.ui.render();

  Reactions.initialize();

  Reactions.track.impression();
});

var Reactions = {

  initialize: function initialize() {
    Reactions.customer.initialize();
  },

  customer: {
    id: null,
    initialize: function initialize() {
      var i = Reactions.cookies.get('reaction_customer_id');
      if (!i) {
        i = 'getnew()';
        Reactions.cookies.set('reaction_customer_id', i);
      }
      Reactions.customer.id = i;
    },
    createID: function createID() {
      Reactions.ajaxGet('http://trippyporn.com/videos/dildo-fun.json').then(JSON.parse).then(function (r) {
        console.log(r);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },

  ui: {
    render: function render() {
      return '<button type="button" onclick="Reactions.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="Reactions.send(\'Reaction 2\');">Reaction 2</button>';
    }
  },

  send: function send(reaction) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', encodeURI('http://reactions-backend.vertaxe.com/create-reaction'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //xhr.onload = function() {
    //  console.log(xhr.status);
    //  console.log(xhr.responseText);
    //};
    xhr.send(encodeURI("name=" + reaction + "&referrer=" + window.location.hostname));
  },


  cookies: Cookies.noConflict(),

  track: {
    impression: function impression() {}
  },

  ajaxGet: function ajaxGet(url) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = function () {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      };

      req.onerror = function () {
        reject(new Error("Network error"));
      };

      req.send();
    });
  }
};
//# sourceMappingURL=latest.js.map
