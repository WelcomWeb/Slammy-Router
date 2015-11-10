/**
* Slammy-Router
*
* A small and easy-to-use router for React
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
* @version 2.0
* @copyright Welcom Web i Göteborg AB 2015
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var getCleanHash = function getCleanHash(hash) {
	hash = hash || window.location.hash;
	return "/" + hash.replace(/^[\/|#]+/g, '');
};

var getRouteFromTable = function getRouteFromTable(hash, routes, notfound) {
	if (!!routes[hash]) {
		return _react2['default'].createElement(routes[hash]);
	}

	for (var route in routes) {
		if (routes.hasOwnProperty(route)) {
			var variables = route.match(/\:([a-z0-9]+)/ig) || [],
			    clean = route.replace(/\/\:([a-z0-9]+)/ig, '');

			if (hash.indexOf(clean) === 0) {
				var _ret = (function () {
					var params = hash.substr(clean.length + 1).split('/'),
					    out = {};

					if (!!variables && variables.length) {
						variables.forEach(function (variable, index) {
							if (!!params[index]) {
								out[variable.substr(1)] = params[index];
							}
						});
					}

					return {
						v: _react2['default'].createElement(routes[route], { params: out })
					};
				})();

				if (typeof _ret === 'object') return _ret.v;
			}
		}
	}

	return _react2['default'].createElement(notfound, { route: hash });
};

var _listeners = [],
    notifyListeners = function notifyListeners(listeners, hash) {
	listeners.forEach(function (listener) {
		listener.call(null, hash);
	});
};

var Router = (function (_React$Component) {
	_inherits(Router, _React$Component);

	_createClass(Router, null, [{
		key: 'propTypes',
		value: {
			"default": _react2['default'].PropTypes.string.isRequired,
			"notfound": _react2['default'].PropTypes.func.isRequired,
			"routes": _react2['default'].PropTypes.object.isRequired
		},
		enumerable: true
	}]);

	function Router(props, context) {
		_classCallCheck(this, Router);

		_get(Object.getPrototypeOf(Router.prototype), 'constructor', this).call(this, props, context);

		this.state = { current: null, route: null };
	}

	_createClass(Router, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this = this;

			var hash = getCleanHash();

			this._intervalId = setInterval(function () {
				var hash = getCleanHash();
				if (hash != _this.state.current) {
					_this.setState({
						current: hash,
						route: getRouteFromTable(hash, _this.props.routes, _this.props.notfound)
					});
					notifyListeners(_listeners, hash);
				}
			}, 10);

			window.location.hash = !!hash.replace('/', '') ? hash : getCleanHash(this.props['default']);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearInterval(this._intervalId);
		}
	}, {
		key: 'setRoute',
		value: function setRoute(route) {
			window.location.hash = route;
			this.setState({
				current: route,
				route: getRouteFromTable(route, this.props.routes, this.props.notfound)
			});
			notifyListeners(_listeners, route);
		}
	}, {
		key: 'render',
		value: function render() {

			if (!this.state.current) {
				return null;
			}

			return this.state.route;
		}
	}], [{
		key: 'addRouteChangeListener',
		value: function addRouteChangeListener(fn) {
			_listeners.push(fn);
		}
	}, {
		key: 'removeRouteChangeListener',
		value: function removeRouteChangeListener(fn) {
			var index = -1;
			_listeners.forEach(function (listener, i) {
				if (listener === fn) {
					index = i;
				}
			});

			if (index >= 0) {
				_listeners.splice(index, 1);
			}
		}
	}]);

	return Router;
})(_react2['default'].Component);

;

exports['default'] = Router;
module.exports = exports['default'];