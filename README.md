# Slammy-Router

[![Build Status](https://travis-ci.org/WelcomWeb/slammy-router.svg?branch=master)](https://travis-ci.org/WelcomWeb/slammy-router)

Slammy-Router is a tiny React router implementation, usable for single page apps. It only uses hashbangs, no pushState.

## Installation

    npm install --save-dev slammy-router

## Usage example

	import React from 'react';
	import ReactDOM from 'react-dom';
	import Router from '../../src/slammy-router';
	
	class DefaultRoute extends React.Component {
		render() {
			
			return (
				<div>
					<p>Default route</p>
					<a href="#/route/second">Go to second route</a>
				</div>
			);
			
		}
	};
	
	class AnotherRoute extends React.Component {
		render() {
			
			return (
				<div>
					<p>Second route</p>
					<a href="#/route/params/ReactUser">Go to parameterized route</a>
				</div>
			);
			
		}
	};
	
	class ParamRoute extends React.Component {
		render() {
			
			return (
				<div>
					<p>Route with param "greeting" for {this.props.params.greeting}</p>
				</div>
			);
			
		}
	};
	
	class NoSuchRoute extends React.Component {
		render() {
			
			return (
				<div>
					<p>The view for '{this.props.route}' was not found</p>
				</div>
			);
			
		}
	};
	
	let routes = {
		"/route/first": DefaultRoute,
		"/route/second": AnotherRoute,
		"/route/params/:greeting": ParamRoute
	};
	
	ReactDOM.render(<Router default="/route/first" notfound={NoSuchRoute} routes={routes} />, document.getElementById('example'));

## Demo

You can clone this repository, and build (`npm run build`) from the `example` directory. Point your web browser to the index file of that same directory to try Slammy-Router.