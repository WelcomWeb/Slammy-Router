'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                  * Slammy-Router
                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                  * A small and easy-to-use router for React
                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                  * @author Björn Wikström <bjorn@welcom.se>
                                                                                                                                                                                                                                                  * @license Apache License 2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
                                                                                                                                                                                                                                                  * @version 2.1
                                                                                                                                                                                                                                                  * @copyright Welcom Web i Göteborg AB 2015
                                                                                                                                                                                                                                                  */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getCleanHash = function getCleanHash(hash) {
	hash = hash || window.location.hash;
	return "/" + hash.replace(/^[\/|#]+/g, '');
};

var getRouteFromTable = function getRouteFromTable(hash, routes, notfound) {
	if (!!routes[hash]) {
		return _react2.default.createElement(routes[hash]);
	}

	for (var route in routes) {
		if (routes.hasOwnProperty(route)) {
			var variables = route.match(/\:([a-z0-9]+)/ig) || [],
			    clean = route.replace(/\/\:([a-z0-9]+)/ig, '');

			if (hash.indexOf(clean) === 0) {
				var _ret = function () {
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
						v: _react2.default.createElement(routes[route], { params: out })
					};
				}();

				if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
			}
		}
	}

	return _react2.default.createElement(notfound, { route: hash });
};

var _listeners = [],
    _routes = {},
    notifyListeners = function notifyListeners(listeners, hash) {
	listeners.forEach(function (listener) {
		listener.call(null, hash);
	});
};

var Router = function (_React$Component) {
	_inherits(Router, _React$Component);

	function Router(props, context) {
		_classCallCheck(this, Router);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this, props, context));

		_routes = props.routes;
		_this.state = { current: null, route: null };
		return _this;
	}

	_createClass(Router, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			_routes = !!nextProps.routes ? nextProps.routes : _routes;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			var hash = getCleanHash();

			this._intervalId = setInterval(function () {
				var hash = getCleanHash();
				if (hash != _this2.state.current) {
					_this2.setState({
						current: hash,
						route: getRouteFromTable(hash, _routes, _this2.props.notfound)
					});
					notifyListeners(_listeners, hash);
				}
			}, 10);

			window.location.hash = !!hash.replace('/', '') ? hash : getCleanHash(this.props.default);
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
				route: getRouteFromTable(route, _routes, this.props.notfound)
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
		key: 'addRoute',
		value: function addRoute(path, route) {
			_routes[path] = route;
		}
	}, {
		key: 'removeRoute',
		value: function removeRoute(path) {
			delete _routes[path];
		}
	}, {
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
}(_react2.default.Component);

Router.propTypes = {
	"default": _react2.default.PropTypes.string.isRequired,
	"notfound": _react2.default.PropTypes.func.isRequired,
	"routes": _react2.default.PropTypes.object.isRequired
};
;

exports.default = Router;
