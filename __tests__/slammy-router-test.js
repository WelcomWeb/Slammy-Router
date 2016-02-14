jest.dontMock('../src/slammy-router.js');

describe('Slammy-Router', function () {
	
	let node = null;
	beforeEach(function () {
		node = document.createElement('div');
	});
	afterEach(function () {
		require('react-dom').unmountComponentAtNode(node);
	});
	
	it('renders a default view', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				})
		};
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={jest.genMockFunction()} />, node);
		reference.setRoute("/default");
		
		var view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("default");
	});
	
	it('renders a view depending on hash', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				}),
			"/test-route": React.createClass({
					render: function () {
						return <div>test-route</div>;
					}
				})
		};
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={jest.genMockFunction()} />, node);
		var view;
		
		reference.setRoute("/default");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("default");
		
		reference.setRoute("/test-route");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("test-route");
	});
	
	it('renders a "Not Found" route', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				})
		};
		
		var notFoundRoute = React.createClass({
			render: function () {
				return <div>notfound</div>;
			}
		});
		
		var reference = ReactDOM.render((<Router default="/default" routes={routes} notfound={notFoundRoute} />), node);
		reference.setRoute("/route-that-doesnt-exist");
		
		var view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("notfound");
	});
	
	it('notify listeners on route change', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				}),
			"/test-route": React.createClass({
					render: function () {
						return <div>test-route</div>;
					}
				})
		};
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={jest.genMockFunction()} />, node);
		var view;
		
		var mock = {
			"callback": function () {}
		};
		spyOn(mock, "callback");
		
		Router.addRouteChangeListener(mock.callback);
		
		reference.setRoute("/default");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("default");
		
		reference.setRoute("/test-route");
		expect(mock.callback).toHaveBeenCalled()
	});
	
	if('doesnt notify detached listeners', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				}),
			"/test-route": React.createClass({
					render: function () {
						return <div>test-route</div>;
					}
				})
		};
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={jest.genMockFunction()} />, node);
		var view;
		
		var mock = {
			"callback": function () {}
		};
		spyOn(mock, "callback");
		
		reference.addRouteChangeListener(mock.callback);
		Router.removeRouteChangeListener(mock.callback);
		
		Router.setRoute("/default");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("default");
		
		reference.setRoute("/test-route");
		expect(mock.callback).not.toHaveBeenCalled()
	});

	it('allows addition of routes during runtime', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				})
		};
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={jest.genMockFunction()} />, node);
		var view;
		
		var mock = {
			"callback": function () {}
		};
		spyOn(mock, "callback");
		
		Router.addRouteChangeListener(mock.callback);
		
		reference.setRoute("/default");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("default");

		Router.addRoute("/test-route", React.createClass({
					render: function () {
						return <div>test-route</div>;
					}
				}));
		
		reference.setRoute("/test-route");
		view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("test-route");
	});

	it('allows deletion of routes during runtime', function () {
		var TestUtils = require('react-addons-test-utils'),
			React = require('react'),
			ReactDOM = require('react-dom'),
			Router = require('../src/slammy-router').default;
		
		var routes = {
			"/default": React.createClass({
					render: function () {
						return <div>default</div>;
					}
				}),
			"/test-route": React.createClass({
					render: function () {
						return <div>test-route</div>;
					}
				})
		};
		
		var notFoundRoute = React.createClass({
			render: function () {
				return <div>notfound</div>;
			}
		});
		
		var reference = ReactDOM.render(<Router default="/default" routes={routes} notfound={notFoundRoute} />, node);
		
		Router.removeRoute("/test-route");

		reference.setRoute("/test-route");
		var view = TestUtils.findRenderedDOMComponentWithTag(reference, 'div');
		expect(view.textContent).toEqual("notfound");
	});
});