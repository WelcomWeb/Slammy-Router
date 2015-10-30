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
import React from 'react';

let getCleanHash = function (hash) {
	hash = hash || window.location.hash;
	return "/" + hash.replace(/^[\/|#]+/g, '');
};

let getRouteFromTable = function (hash, routes, notfound) {
	if (!!routes[hash]) {
		return React.createElement(routes[hash]);
	}
	
	for (let route in routes) {
		if (routes.hasOwnProperty(route)) {
			let variables = route.match(/\:([a-z0-9]+)/ig),
				clean = route.replace(/\/\:([a-z0-9]+)/ig, '');
			
			if (hash.indexOf(clean) === 0) {
				let params = hash.substr(clean.length + 1).split('/'),
					out = {};
				
				variables.forEach(function (variable, index) {
					if (!!params[index]) {
						out[variable.substr(1)] = params[index];
					}
				});
				
				return React.createElement(routes[route], { params: out });
			}
		}
	}
	
	return React.createElement(notfound, { route: hash });
};

let _listeners = [],
	notifyListeners = function (listeners, hash) {
		listeners.forEach(function (listener) {
			listener.call(null, hash);
		});
	};

class Router extends React.Component {
	static propTypes = {
		"default": React.PropTypes.string.isRequired,
		"notfound": React.PropTypes.func.isRequired,
		"routes": React.PropTypes.object.isRequired,
	};
	
	constructor(props, context) {
		super(props, context);
		
		this.state = { current: null, route: null };
	}
	
	componentDidMount() {
		let hash = getCleanHash();
		
		this._intervalId = setInterval(() => {
			let hash = getCleanHash();
			if (hash != this.state.current) {
				this.setState({
					current: hash,
					route: getRouteFromTable(hash, this.props.routes, this.props.notfound)
				});
				notifyListeners(_listeners, hash);
			}
		}, 10);
		
		window.location.hash = !!hash.replace('/', '') ? hash : getCleanHash(this.props.default);
	}
	
	componentWillUnmount() {
		clearInterval(this._intervalId);
	}
	
	addRouteChangeListener(fn) {
		_listeners.push(fn);
	}
	
	removeRouteChangeListener(fn) {
		let index = -1;
		_listeners.forEach(function (listener, i) {
			if (listener === fn) {
				index = i;
			}
		});
		
		if (index >= 0) {
			_listeners.splice(index, 1);
		}
	}
	
	setRoute(route) {
		window.location.hash = route;
		this.setState({
			current: route,
			route: getRouteFromTable(route, this.props.routes, this.props.notfound)
		});
		notifyListeners(_listeners, route);
	}
	
	render() {
		
		if (!this.state.current) {
			return null;
		}
		
		return this.state.route;
		
	}
};

export default Router;