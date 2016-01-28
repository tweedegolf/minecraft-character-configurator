module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {


	/*
	 * Copyright (c) 2014 Gary Haussmann
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	//
	// Lots of code here is based on react-art: https://github.com/facebook/react-art
	//

	'use strict';

	var ReactDOM = __webpack_require__(1);

	// monkey patch to workaround some assumptions that we're working with the DOM
	var monkeypatch = __webpack_require__(3);
	monkeypatch();

	module.exports = {
	    Scene: __webpack_require__(10),
	    PerspectiveCamera: __webpack_require__(22),
	    OrthographicCamera: __webpack_require__(62),
	    AxisHelper: __webpack_require__(63),
	    Line: __webpack_require__(64),
	    PointCloud: __webpack_require__(65),
	    Object3D: __webpack_require__(66),
	    Mesh: __webpack_require__(67),
	    SkinnedMesh: __webpack_require__(68),
	    Sprite: __webpack_require__(69),
	    AmbientLight: __webpack_require__(70),
	    PointLight: __webpack_require__(72),
	    AreaLight: __webpack_require__(73),
	    DirectionalLight: __webpack_require__(74),
	    HemisphereLight: __webpack_require__(76),
	    SpotLight: __webpack_require__(77),
	    Constants: __webpack_require__(78),
	    render: ReactDOM.render,
	    unmountComponentAtNode: ReactDOM.unmountComponentAtNode
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactDOM");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	//
	// time to monkey-patch React!
	//
	// a subtle bug happens when ReactCompositeComponent updates something in-place by
	// modifying HTML markup; since THREE objects don't exist as markup the whole thing bombs.
	// we try to fix this by monkey-patching ReactCompositeComponent
	//

	"use strict";

	var ReactCompositeComponent = __webpack_require__(4);
	var ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;
	var ReactReconciler = __webpack_require__(5);

	var shouldUpdateReactComponent = __webpack_require__(6);
	var warning = __webpack_require__(7);

	//
	// Composite components don't have an Object3D. So we have to do some work to find
	// the proper Object3D sometimes.
	//

	function findObject3DChild(componentinstance) {
	  // walk downwards via _renderedComponent to find something with a displayObject
	  var componentwalker = componentinstance;
	  while (typeof componentwalker !== 'undefined') {
	    // no displayObject? then fail
	    if (typeof componentwalker._THREEObject3D !== 'undefined') {
	      return componentwalker._THREEObject3D;
	    }
	    componentwalker = componentwalker._renderedComponent;
	  }

	  // we walked all the way down and found no Object3D
	  return undefined;
	}

	//
	// This modified version of updateRenderedComponent will
	// manage Object3D nodes instead of HTML markup
	//
	var old_updateRenderedComponent = ReactCompositeComponentMixin._updateRenderedComponent;

	var ReactTHREE_updateRenderedComponent = function ReactTHREE_updateRenderedComponent(transaction, context) {
	  var prevComponentInstance = this._renderedComponent;

	  // Find the first actual rendered (non-Composite) component.
	  // If that component is a THREE node we use the special code here.
	  // If not, we call back to the original version of updateComponent
	  // which should handle all non-THREE nodes.

	  var prevObject3D = findObject3DChild(prevComponentInstance);
	  if (!prevObject3D) {
	    // not a THREE node, use the original DOM-style version
	    old_updateRenderedComponent.call(this, transaction, context);
	    return;
	  }

	  // This is a THREE node, do a special THREE version of updateComponent
	  var prevRenderedElement = prevComponentInstance._currentElement;
	  var nextRenderedElement = this._renderValidatedComponent();

	  if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
	    ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
	  } else {
	    // We can't just update the current component.
	    // So we nuke the current instantiated component and put a new component in
	    // the same place based on the new props.
	    var thisID = this._rootNodeID;

	    var object3DParent = prevObject3D.parent;

	    // unmounting doesn't disconnect the child from the parent node,
	    // but later on we'll simply overwrite the proper element in the 'children' data member
	    var object3DIndex = object3DParent.children.indexOf(prevObject3D);
	    ReactReconciler.unmountComponent(prevComponentInstance);

	    // create the new object and stuff it into the place vacated by the old object
	    this._renderedComponent = this._instantiateReactComponent(nextRenderedElement, this._currentElement.type);
	    var nextObject3D = ReactReconciler.mountComponent(this._renderedComponent, thisID, transaction, this._processChildContext(context));
	    this._renderedComponent._THREEObject3D = nextObject3D;

	    // fixup _mountImage as well
	    this._mountImage = nextObject3D;

	    // overwrite the old child
	    object3DParent.children[object3DIndex] = nextObject3D;
	  }
	};

	//
	// This generates a patched version of ReactReconciler.receiveComponent to check the type of the
	// component and patch it if it's an unpatched version of ReactCompositeComponentWrapper
	//

	var buildPatchedReceiveComponent = function buildPatchedReceiveComponent(oldReceiveComponent) {
	  var newReceiveComponent = function newReceiveComponent(internalInstance, nextElement, transaction, context) {
	    // if the instance is a ReactCompositeComponentWrapper, fixed it if needed
	    var ComponentPrototype = Object.getPrototypeOf(internalInstance);

	    // if this is a composite component it wil have _updateRenderedComponent defined
	    if (typeof ComponentPrototype._updateRenderedComponent !== 'undefined') {
	      // check first to make sure we don't patch it twice
	      if (ComponentPrototype._updateRenderedComponent !== ReactTHREE_updateRenderedComponent) {
	        ComponentPrototype._updateRenderedComponent = ReactTHREE_updateRenderedComponent;
	      }
	    }

	    oldReceiveComponent.call(this, internalInstance, nextElement, transaction, context);
	  };

	  return newReceiveComponent;
	};

	var ReactTHREEMonkeyPatch = function ReactTHREEMonkeyPatch() {

	  // in order version we patched ReactCompositeComponentMixin, but in 0.13 the
	  // prototype is wrapped in a ReactCompositeComponentWrapper so monkey-patching
	  // ReactCompositeComponentMixin won't actually have any effect.
	  //
	  // Really we want to patch ReactCompositeComponentWrapper but it's hidden inside
	  // the instantiateReactComponent module. urgh.
	  //
	  // So what we have to do is patch ReactReconciler to detect the first time an
	  // instance of ReactCompositeComponentWrapper is used, and patch it THEN
	  //
	  // urk.

	  var old_ReactReconciler_receiveComponent = ReactReconciler.receiveComponent;

	  // check to see if we already patched it, so we don't patch again
	  if (typeof old_ReactReconciler_receiveComponent._ReactTHREEPatched === 'undefined') {
	    warning(false, "patching react to work with react-three");

	    ReactReconciler.receiveComponent = buildPatchedReceiveComponent(old_ReactReconciler_receiveComponent);
	    ReactReconciler.receiveComponent._ReactTHREEPatched = true;
	  }
	};

	module.exports = ReactTHREEMonkeyPatch;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactCompositeComponent");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactReconciler");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("react/lib/shouldUpdateReactComponent");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */

	"use strict";

	var emptyFunction = __webpack_require__(9);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  warning = function (condition, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }

	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */

	"use strict";

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(11);
	var ReactDOM = __webpack_require__(1);
	var ReactMount = __webpack_require__(12);
	var ReactUpdates = __webpack_require__(13);
	var warning = __webpack_require__(7);
	var THREE = __webpack_require__(14);
	var THREEContainerMixin = __webpack_require__(15);
	var THREEObject3DMixin = __webpack_require__(19);

	var ReactBrowserEventEmitter = __webpack_require__(21);
	var putListener = ReactBrowserEventEmitter.putListener;
	var listenTo = ReactBrowserEventEmitter.listenTo;

	var ELEMENT_NODE_TYPE = 1; // some stuff isn't exposed by ReactDOMComponent

	//
	// The 'Scene' component includes both the three.js scene and
	// the canvas DOM element that three.js renders onto.
	//

	var THREEScene = React.createClass({
	    displayName: 'THREEScene',
	    mixins: [THREEContainerMixin],

	    propTypes: {
	        enableRapidRender: React.PropTypes.bool,
	        pixelRatio: React.PropTypes.number,
	        pointerEvents: React.PropTypes.arrayOf(React.PropTypes.string),
	        transparent: React.PropTypes.bool,
	        disableHotLoader: React.PropTypes.bool
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            enableRapidRender: true,
	            pixelRatio: 1,
	            transparent: false,
	            disableHotLoader: false
	        };
	    },

	    setApprovedDOMProperties: function setApprovedDOMProperties(nextProps) {
	        var prevProps = this.props;

	        var prevPropsSubset = {
	            accesskey: prevProps.accesskey,
	            className: prevProps.className,
	            draggable: prevProps.draggable,
	            role: prevProps.role,
	            style: prevProps.style,
	            tabindex: prevProps.tabindex,
	            title: prevProps.title
	        };

	        var nextPropsSubset = {
	            accesskey: nextProps.accesskey,
	            className: nextProps.className,
	            draggable: nextProps.draggable,
	            role: nextProps.role,
	            style: nextProps.style,
	            tabindex: nextProps.tabindex,
	            title: nextProps.title
	        };

	        this.props = nextPropsSubset;
	        this._updateDOMProperties(prevPropsSubset);

	        // Reset to normal state
	        this.props = prevProps;
	    },

	    componentDidMount: function componentDidMount() {
	        var _this = this;

	        var renderelement = this.props.canvas || ReactDOM.findDOMNode(this);
	        var props = this.props;
	        var context = this._reactInternalInstance._context;

	        this._THREEObject3D = new THREE.Scene();
	        this._THREErenderer = new THREE.WebGLRenderer({
	            alpha: this.props.transparent,
	            canvas: renderelement,
	            antialias: props.antialias === undefined ? true : props.antialias
	        });
	        this._THREErenderer.shadowMap.enabled = props.shadowMapEnabled !== undefined ? props.shadowMapEnabled : false;
	        if (props.shadowMapType !== undefined) {
	            this._THREErenderer.shadowMap.type = props.shadowMapType;
	        }
	        this._THREErenderer.setPixelRatio(props.pixelRatio);
	        this._THREErenderer.setSize(+props.width, +props.height);
	        this._THREEraycaster = new THREE.Raycaster();
	        //this.setApprovedDOMProperties(props);
	        THREEObject3DMixin.applyTHREEObject3DPropsToObject(this._THREEObject3D, {}, props);

	        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
	        transaction.perform(this.mountAndAddChildren, this, props.children, transaction, context);
	        ReactUpdates.ReactReconcileTransaction.release(transaction);
	        // hack for react-hot-loader
	        if (!this.props.disableHotLoader) {
	            this._reactInternalInstance._renderedComponent._renderedChildren = this._renderedChildren;
	        }

	        // can't look for refs until children get mounted
	        var camera = props.camera;
	        if (typeof camera === 'string') {
	            camera = this._THREEObject3D.getObjectByName(camera, true);
	        } else if (camera === null || typeof camera === 'undefined') {
	            warning(false, "No camera prop specified for react-three scene, using 'maincamera'");
	            // look for a 'maincamera' object; if none, then make a default camera
	            camera = this._THREEObject3D.getObjectByName('maincamera', true);
	            if (typeof camera === 'undefined') {
	                warning(false, "No camera named 'maincamera' found, creating a default camera");
	                camera = new THREE.PerspectiveCamera(75, props.width / props.height, 1, 5000);
	                camera.aspect = props.width / props.height;
	                camera.updateProjectionMatrix();
	                camera.position.z = 600;
	            }
	        }

	        var backgroundtype = typeof props.background;
	        if (backgroundtype !== 'undefined') {
	            // background color should be a number, check it
	            warning(backgroundtype === 'number', "The background property of " + "the scene component must be a number, not " + backgroundtype);
	            this._THREErenderer.setClearColor(props.background, this.props.transparent ? 0 : 1);
	        }

	        this._THREEcamera = camera;

	        this.mountOrbitControls(props);

	        this.renderScene();

	        // The canvas gets re-rendered every frame even if no props/state changed.
	        // This is because some three.js items like skinned meshes need redrawing
	        // every frame even if nothing changed in React props/state.
	        //
	        // See https://github.com/Izzimach/react-three/issues/28

	        if (this.props.enableRapidRender) {
	            (function () {
	                var rapidrender = function rapidrender(timestamp) {

	                    _this._timestamp = timestamp;
	                    _this._rAFID = window.requestAnimationFrame(rapidrender);

	                    // render the stage
	                    _this.renderScene();
	                };

	                _this._rAFID = window.requestAnimationFrame(rapidrender);
	            })();
	        }

	        // warn users of the old listenToClick prop
	        warning(typeof props.listenToClick === 'undefined', "the `listenToClick` prop has been replaced with `pointerEvents`");

	        if (props.pointerEvents) {
	            (function () {
	                // fiddle with some internals here - probably a bit brittle
	                var internalInstance = _this._reactInternalInstance;
	                var container = ReactMount.findReactContainerForID(internalInstance._rootNodeID);

	                props.pointerEvents.forEach(function (eventName) {
	                    if (container) {
	                        var doc = container.nodeType === ELEMENT_NODE_TYPE ? container.ownerDocument : container;
	                        listenTo(eventName, doc);
	                    }
	                    putListener(internalInstance._rootNodeID, eventName, function (event) {
	                        return _this.projectPointerEvent(event, eventName);
	                    });
	                });
	            })();
	        }

	        renderelement.onselectstart = function () {
	            return false;
	        };
	    },

	    componentDidUpdate: function componentDidUpdate(oldProps) {
	        var props = this.props;
	        var context = this._reactInternalInstance._context;

	        if (props.pixelRatio != oldProps.pixelRatio) {
	            this._THREErenderer.setPixelRatio(props.pixelRatio);
	        }

	        if (props.width != oldProps.width || props.width != oldProps.height || props.pixelRatio != oldProps.pixelRatio) {
	            this._THREErenderer.setSize(+props.width, +props.height);
	        }

	        var backgroundtype = typeof props.background;
	        if (backgroundtype !== 'undefined') {
	            // background color should be a number, check it
	            warning(backgroundtype === 'number', "The background property of " + "the scene component must be a number, not " + backgroundtype);
	            this._THREErenderer.setClearColor(props.background, this.props.transparent ? 0 : 1);
	        }

	        THREEObject3DMixin.applyTHREEObject3DPropsToObject(this._THREEObject3D, oldProps, props);

	        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
	        transaction.perform(this.updateChildren, this, this.props.children, transaction, context);
	        ReactUpdates.ReactReconcileTransaction.release(transaction);
	        // hack for react-hot-loader
	        if (!this.props.disableHotLoader) {
	            this._reactInternalInstance._renderedComponent._renderedChildren = this._renderedChildren;
	        }

	        if (typeof props.camera === 'string') {
	            this._THREEcamera = this._THREEObject3D.getObjectByName(props.camera);
	        } else {
	            THREEObject3DMixin.applyTHREEObject3DPropsToObject(this._THREEcamera, oldProps.camera || {}, props.camera || {});
	        }

	        this.mountOrbitControls(props);

	        this.renderScene();
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        // hack for react-hot-loader
	        if (!this.props.disableHotLoader) {
	            this._reactInternalInstance._renderedComponent._renderedChildren = null;
	        }
	        this.unmountChildren();
	        ReactBrowserEventEmitter.deleteAllListeners(this._reactInternalInstance._rootNodeID);
	        if (typeof this._rAFID !== 'undefined') {
	            window.cancelAnimationFrame(this._rAFID);
	        }
	    },

	    mountOrbitControls: function mountOrbitControls(props) {
	        //console.log('mountOrbitControls', this.props);
	        if (props.orbitControls) {
	            if (!this.orbitControls) {
	                this.orbitControls = new props.orbitControls(this._THREEcamera, ReactDOM.findDOMNode(this));
	            }
	            /*
	                        if(props.onControllerChange){
	                            //console.log(this.orbitControls);
	                            // this.orbitControls.onChange = props.onControllerChange;
	                            this.orbitControls.addEventListener('change', function(e){
	                                props.onControllerChange(e);
	                                renderScene();
	                            });
	                        }
	            */
	            if (!props.enableRapidRender) {
	                var renderScene = this.renderScene;
	                this.orbitControls.addEventListener('change', function (e) {
	                    props.onControllerChange(e);
	                    renderScene();
	                });
	            }
	        }
	    },

	    renderScene: function renderScene() {
	        //console.log('renderScene');
	        this._THREErenderer.render(this._THREEObject3D, this._THREEcamera);
	    },

	    render: function render() {
	        if (this.props.canvas) return null;

	        // the three.js renderer will get applied to this canvas element
	        return React.createElement("canvas");
	    },

	    projectPointerEvent: function projectPointerEvent(event, eventName) {
	        event.preventDefault();
	        var canvas = this.props.canvas || ReactDOM.findDOMNode(this);
	        var rect = canvas.getBoundingClientRect();

	        var _ref = event.touches ? event.touches[0] : event;

	        var clientX = _ref.clientX;
	        var clientY = _ref.clientY;

	        var x = (clientX - rect.left) / this.props.width * 2 - 1;
	        var y = -((clientY - rect.top) / this.props.height) * 2 + 1;

	        var mousecoords = new THREE.Vector3(x, y, 0.5);
	        var raycaster = this._THREEraycaster;
	        var camera = this._THREEcamera;

	        mousecoords.unproject(camera);
	        raycaster.ray.set(camera.position, mousecoords.sub(camera.position).normalize());

	        var intersections = raycaster.intersectObjects(this._THREEObject3D.children, true);
	        var firstintersection = intersections.length > 0 ? intersections[0] : null;

	        if (firstintersection !== null) {
	            var pickobject = firstintersection.object;
	            if (typeof pickobject.userData !== 'undefined' && pickobject.userData._currentElement) {
	                var onpickfunction = pickobject.userData._currentElement.props[eventName + '3D'];
	                if (typeof onpickfunction === 'function') {
	                    onpickfunction(event, firstintersection);
	                }
	            }
	        }
	    }
	});

	module.exports = THREEScene;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactMount");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactUpdates");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("three");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ReactMultiChild = __webpack_require__(16);
	var emptyObject = __webpack_require__(17);
	var assign = __webpack_require__(18);

	//
	// Generates a React component by combining several mixin components
	//

	var THREEContainerMixin = assign({}, ReactMultiChild.Mixin, {
	    moveChild: function moveChild(child, toIndex) {
	        var childTHREEObject3D = child._mountImage; // should be a three.js Object3D
	        var THREEObject3D = this._THREEObject3D;

	        var childindex = THREEObject3D.children.indexOf(childTHREEObject3D);
	        if (childindex === -1) {
	            throw new Error('The object to move needs to already be a child');
	        }

	        // remove from old location, put in the new location
	        THREEObject3D.children.splice(childindex, 1);
	        THREEObject3D.children.splice(toIndex, 0, childTHREEObject3D);
	    },

	    createChild: function createChild(child, childTHREEObject3D) {
	        child._mountImage = childTHREEObject3D;
	        this._THREEObject3D.add(childTHREEObject3D);
	    },

	    removeChild: function removeChild(child) {
	        var childTHREEObject3D = child._mountImage;

	        this._THREEObject3D.remove(childTHREEObject3D);
	        child._mountImage = null;
	    },

	    /**
	     * Override to bypass batch updating because it is not necessary.
	     *
	     * @param {?object} nextChildren.
	     * @param {ReactReconcileTransaction} transaction
	     * @internal
	     * @override {ReactMultiChild.Mixin.updateChildren}
	     */
	    updateChildren: function updateChildren(nextChildren, transaction, context) {
	        this._updateChildren(nextChildren, transaction, context);
	    },

	    // called by any container component after it gets mounted
	    mountAndAddChildren: function mountAndAddChildren(children, transaction, context) {
	        var mountedImages = this.mountChildren(children, transaction, context);
	        // Each mount image corresponds to one of the flattened children
	        var i = 0;
	        for (var key in this._renderedChildren) {
	            if (this._renderedChildren.hasOwnProperty(key)) {
	                var child = this._renderedChildren[key];
	                child._mountImage = mountedImages[i];
	                this._THREEObject3D.add(child._mountImage);
	                i++;
	            }
	        }
	    }
	});

	module.exports = THREEContainerMixin;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactMultiChild");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyObject
	 */

	'use strict';

	var emptyObject = {};

	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("react/lib/Object.assign");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(20)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _three = __webpack_require__(14);

	var _three2 = _interopRequireDefault(_three);

	var _reactLibObjectAssign = __webpack_require__(18);

	var _reactLibObjectAssign2 = _interopRequireDefault(_reactLibObjectAssign);

	var _THREEContainerMixin = __webpack_require__(15);

	var _THREEContainerMixin2 = _interopRequireDefault(_THREEContainerMixin);

	//
	// The container methods are use by both the THREEScene composite component
	// and by THREEObject3D components, so container/child stuff is in a separate
	// mixin (THREEContainerMixin) and here gets merged into the typical THREE
	// node methods for applying and updating props
	//
	var THREEObject3DMixin = (0, _reactLibObjectAssign2['default'])({}, _THREEContainerMixin2['default'], {

	    construct: function construct(element) {
	        this._currentElement = element;
	        this._THREEObject3D = null;
	    },

	    getPublicInstance: function getPublicInstance() {
	        return this._THREEObject3D;
	    },

	    createTHREEObject: function createTHREEObject() {
	        return new _three2['default'].Object3D();
	    },

	    applyTHREEObject3DProps: function applyTHREEObject3DProps(oldProps, props) {
	        this.applyTHREEObject3DPropsToObject(this._THREEObject3D, oldProps, props);
	    },

	    applyTHREEObject3DPropsToObject: function applyTHREEObject3DPropsToObject(THREEObject3D, oldProps, props) {
	        // these props have defaults
	        if (typeof props.position !== 'undefined') {
	            THREEObject3D.position.copy(props.position);
	        } else {
	            THREEObject3D.position.set(0, 0, 0);
	        }

	        if (typeof props.quaternion !== 'undefined') {
	            THREEObject3D.quaternion.copy(props.quaternion);
	        } else {
	            THREEObject3D.quaternion.set(0, 0, 0, 1); // no rotation
	        }

	        if (typeof props.visible !== 'undefined') {
	            THREEObject3D.visible = props.visible;
	        } else {
	            THREEObject3D.visible = true;
	        }

	        if (typeof props.scale === "number") {
	            THREEObject3D.scale.set(props.scale, props.scale, props.scale);
	        } else if (props.scale instanceof _three2['default'].Vector3) {
	            // copy over scale values
	            THREEObject3D.scale.copy(props.scale);
	        } else {
	            THREEObject3D.scale.set(1, 1, 1);
	        }

	        if (typeof props.up !== 'undefined') {
	            THREEObject3D.up.copy(props.up);
	        }

	        if (typeof props.lookat !== 'undefined') {
	            THREEObject3D.lookAt(props.lookat);
	        }

	        if (typeof props.name !== 'undefined') {
	            THREEObject3D.name = props.name;
	        }

	        if (typeof props.castShadow !== 'undefined') {
	            THREEObject3D.castShadow = props.castShadow;
	        }

	        if (typeof props.receiveShadow !== 'undefined') {
	            THREEObject3D.receiveShadow = props.receiveShadow;
	        }

	        if (typeof props.fog !== 'undefined') {
	            THREEObject3D.fog = props.fog;
	        }
	    },

	    transferTHREEObject3DPropsByName: function transferTHREEObject3DPropsByName(oldProps, newProps, propnames) {
	        var THREEObject3D = this._THREEObject3D;

	        propnames.forEach(function (propname) {
	            if (typeof newProps[propname] !== 'undefined') {
	                THREEObject3D[propname] = newProps[propname];
	            }
	        });
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps() /*oldProps, newProps*/{
	        // the default props are applied in applyTHREEObject3DProps.
	        // to create a new object type, mixin your own version of this method
	    },

	    mountComponent: function mountComponent(rootID, transaction, context) {
	        var props = this._currentElement.props;
	        /* jshint unused: vars */
	        this._THREEObject3D = this.createTHREEObject(arguments);
	        this._THREEObject3D.userData = this;
	        this.applyTHREEObject3DProps({}, props);
	        this.applySpecificTHREEProps({}, props);

	        this.mountAndAddChildren(props.children, transaction, context);
	        return this._THREEObject3D;
	    },

	    receiveComponent: function receiveComponent(nextElement, transaction, context) {
	        var oldProps = this._currentElement.props;
	        var props = nextElement.props;
	        this.applyTHREEObject3DProps(oldProps, props);
	        this.applySpecificTHREEProps(oldProps, props);

	        this.updateChildren(props.children, transaction, context);
	        this._currentElement = nextElement;
	    },

	    unmountComponent: function unmountComponent() {
	        this.unmountChildren();
	    },

	    /*eslint no-unused-vars: [2, { "args": "none" }]*/
	    mountComponentIntoNode: function mountComponentIntoNode(rootID, container) {
	        throw new Error('You cannot render an THREE Object3D standalone. ' + 'You need to wrap it in a THREEScene.');
	    }
	});

	exports['default'] = THREEObject3DMixin;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("react/lib/ReactBrowserEventEmitter");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEPerspectiveCamera = createTHREEComponent('PerspectiveCamera', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.PerspectiveCamera();
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['fov', 'aspect', 'near', 'far']);

	        this._THREEObject3D.updateProjectionMatrix();
	    }
	});

	module.exports = THREEPerspectiveCamera;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getIterator = __webpack_require__(24)['default'];

	var _interopRequireDefault = __webpack_require__(20)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.createTHREEComponent = createTHREEComponent;
	exports.setNewLightColor = setNewLightColor;

	var _three = __webpack_require__(14);

	var _three2 = _interopRequireDefault(_three);

	var _reactLibObjectAssign = __webpack_require__(18);

	var _reactLibObjectAssign2 = _interopRequireDefault(_reactLibObjectAssign);

	var _fbjsLibWarning = __webpack_require__(7);

	var _fbjsLibWarning2 = _interopRequireDefault(_fbjsLibWarning);

	function createTHREEComponent(name) {
	  var ReactTHREEComponent = function ReactTHREEComponent() /*props*/{
	    this.node = null;
	    this._mountImage = null;
	    this._renderedChildren = null;
	    this._THREEObject3D = null;
	  };
	  ReactTHREEComponent.displayName = name;

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      mixins[_key - 1] = arguments[_key];
	    }

	    for (var _iterator = _getIterator(mixins), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var m = _step.value;

	      (0, _reactLibObjectAssign2['default'])(ReactTHREEComponent.prototype, m);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return ReactTHREEComponent;
	}

	function setNewLightColor(targetColor, sourceValue) {
	  // function to set a light color. The sourcevalue
	  // can be either a number (usually in hex: 0xff0000)
	  // or a THREE.Color

	  // is the prop a hex number or a THREE.Color?
	  if (typeof sourceValue === 'number') {
	    targetColor.setHex(sourceValue);
	  } else if (typeof sourceValue === 'object' && sourceValue !== null && sourceValue instanceof _three2['default'].Color) {
	    targetColor.copy(sourceValue);
	  } else {
	    (0, _fbjsLibWarning2['default'])(false, "Light color must be a number or an instance of THREE.Color");
	  }
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(25), __esModule: true };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26);
	__webpack_require__(54);
	module.exports = __webpack_require__(57);

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	var Iterators = __webpack_require__(30);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(28)
	  , step             = __webpack_require__(29)
	  , Iterators        = __webpack_require__(30)
	  , toIObject        = __webpack_require__(31);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(35)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(32)
	  , defined = __webpack_require__(34);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(33);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(36)
	  , $export        = __webpack_require__(37)
	  , redefine       = __webpack_require__(42)
	  , hide           = __webpack_require__(43)
	  , has            = __webpack_require__(48)
	  , Iterators      = __webpack_require__(30)
	  , $iterCreate    = __webpack_require__(49)
	  , setToStringTag = __webpack_require__(50)
	  , getProto       = __webpack_require__(44).getProto
	  , ITERATOR       = __webpack_require__(51)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(38)
	  , core      = __webpack_require__(39)
	  , ctx       = __webpack_require__(40)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 38 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 39 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(41);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(43);

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(44)
	  , createDesc = __webpack_require__(45);
	module.exports = __webpack_require__(46) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(47)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(44)
	  , descriptor     = __webpack_require__(45)
	  , setToStringTag = __webpack_require__(50)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(43)(IteratorPrototype, __webpack_require__(51)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(44).setDesc
	  , has = __webpack_require__(48)
	  , TAG = __webpack_require__(51)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(52)('wks')
	  , uid    = __webpack_require__(53)
	  , Symbol = __webpack_require__(38).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(38)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(55)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(35)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(56)
	  , defined   = __webpack_require__(34);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(58)
	  , get      = __webpack_require__(60);
	module.exports = __webpack_require__(39).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(59);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(61)
	  , ITERATOR  = __webpack_require__(51)('iterator')
	  , Iterators = __webpack_require__(30);
	module.exports = __webpack_require__(39).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(33)
	  , TAG = __webpack_require__(51)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEOrthographicCamera = createTHREEComponent('OrthographicCamera', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.OrthographicCamera();
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['left', 'right', 'top', 'bottom', 'near', 'far']);

	        this._THREEObject3D.updateProjectionMatrix();
	    }
	});

	module.exports = THREEOrthographicCamera;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEAxisHelper = createTHREEComponent('AxisHelper', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.AxisHelper(this._currentElement.props.size || 5);
	    }
	});
	module.exports = THREEAxisHelper;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREELine = createTHREEComponent('Line', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.Line(new THREE.Geometry());
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['geometry', 'material', 'mode']);
	    }
	});
	module.exports = THREELine;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEPointCloud = createTHREEComponent('PointCloud', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.PointCloud(new THREE.Geometry());
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['geometry', 'material', 'frustumCulled', 'sortParticles']);
	    }
	});

	module.exports = THREEPointCloud;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEObject3D = createTHREEComponent('Object3D', THREEObject3DMixin);

	module.exports = THREEObject3D;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREEMesh = createTHREEComponent('Mesh', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.Mesh(new THREE.Geometry(), new THREE.Material()); // starts out empty
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        var THREEObject3D = this._THREEObject3D;
	        if (typeof newProps.geometry !== 'undefined' && newProps.geometry !== oldProps.geometry) {
	            THREEObject3D.geometry = newProps.geometry;
	        }

	        if (typeof newProps.material !== 'undefined' && newProps.material !== oldProps.material) {
	            THREEObject3D.material = newProps.material;
	        }
	    }
	});

	module.exports = THREEMesh;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREESkinnedMesh = createTHREEComponent('SkinnedMesh', THREEObject3DMixin, {
	    // skinned mesh is special since it needs the geometry and material data upon construction
	    /* jshint unused: vars */
	    mountComponent: function mountComponent(rootID, transaction, context) {
	        this._THREEObject3D = new THREE.SkinnedMesh(this._currentElement.props.geometry, this._currentElement.props.material);
	        this.applyTHREEObject3DProps({}, this._currentElement.props);
	        this.applySpecificTHREEProps({}, this._currentElement.props);

	        this.mountAndAddChildren(this._currentElement.props.children, transaction, context);
	        return this._THREEObject3D;
	    },
	    /* jshint unused: true */

	    applySpecificTHREEProps: function applySpecificTHREEProps() /*oldProps, newProps*/{}
	});

	module.exports = THREESkinnedMesh;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);

	var THREESprite = createTHREEComponent('Sprite', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.Sprite();
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['material']);
	    }
	});
	module.exports = THREESprite;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);
	var LightObjectMixin = __webpack_require__(71);

	var THREEAmbientLight = createTHREEComponent('AmbientLight', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.AmbientLight(0x000000);
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        LightObjectMixin.applySpecificTHREEProps.call(this, oldProps, newProps);
	    }
	});

	module.exports = THREEAmbientLight;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _Utils = __webpack_require__(23);

	var LightObjectMixin = {
	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        var THREEObject3D = this._THREEObject3D;
	        if (typeof newProps.color !== 'undefined' && newProps.color !== oldProps.color) {
	            (0, _Utils.setNewLightColor)(THREEObject3D.color, newProps.color);
	        }
	    }
	};

	exports['default'] = LightObjectMixin;
	module.exports = exports['default'];

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);
	var LightObjectMixin = __webpack_require__(71);

	var THREEPointLight = createTHREEComponent('PointLight', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.PointLight(0xffffff, 1, 100);
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        LightObjectMixin.applySpecificTHREEProps.call(this, oldProps, newProps);

	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['intensity', 'distance']);
	    }
	});
	module.exports = THREEPointLight;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);
	var LightObjectMixin = __webpack_require__(71);

	var THREEAreaLight = createTHREEComponent('AreaLight', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.AreaLight(0xffffff, 1);
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        LightObjectMixin.applySpecificTHREEProps.call(this, oldProps, newProps);

	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['right', 'normal', 'height', 'width', 'intensity', 'constantAttenuation', 'linearAttenuation', 'quadraticAttenuation']);
	    }
	});

	module.exports = THREEAreaLight;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);
	var LightObjectMixin = __webpack_require__(71);

	var CommonShadowmapProps = __webpack_require__(75);

	var THREEDirectionalLight = createTHREEComponent('DirectionalLight', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.DirectionalLight(0xffffff, 1);
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        LightObjectMixin.applySpecificTHREEProps.call(this, oldProps, newProps);

	        this.transferTHREEObject3DPropsByName(oldProps, newProps, CommonShadowmapProps);

	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['target', 'intensity', 'onlyShadow', 'shadowCameraLeft', 'shadowCameraRight', 'shadowCameraTop', 'shadowCameraBottom', 'shadowCascade', 'shadowCascadeOffset', 'shadowCascadeCount', 'shadowCascadeBias', 'shadowCascadeWidth', 'shadowCascadeHeight', 'shadowCascadeNearZ', 'shadowCascadeFarZ', 'shadowCascadeArray']);
	    }
	});

	module.exports = THREEDirectionalLight;

/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['shadowCameraNear', 'shadowCameraFar', 'shadowCameraVisible', 'shadowBias', 'shadowDarkness', 'shadowMapWidth', 'shadowMapHeight', 'shadowMap', 'shadowMapSize', 'shadowCamera', 'shadowMatrix'];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(20)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _three = __webpack_require__(14);

	var _three2 = _interopRequireDefault(_three);

	var _Utils = __webpack_require__(23);

	var _mixinsTHREEObject3DMixin = __webpack_require__(19);

	var _mixinsTHREEObject3DMixin2 = _interopRequireDefault(_mixinsTHREEObject3DMixin);

	var _mixinsLightObjectMixin = __webpack_require__(71);

	var _mixinsLightObjectMixin2 = _interopRequireDefault(_mixinsLightObjectMixin);

	var THREEHemisphereLight = (0, _Utils.createTHREEComponent)('HemisphereLight', _mixinsTHREEObject3DMixin2['default'], {
	  createTHREEObject: function createTHREEObject() {
	    return new _three2['default'].HemisphereLight(0x8888ff, 0x000000, 1);
	  },

	  applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	    _mixinsLightObjectMixin2['default'].applySpecificTHREEProps.call(this, oldProps, newProps);

	    // sky color gets mapped to 'color'
	    if (typeof newProps.skyColor !== 'undefined') {
	      (0, _Utils.setNewLightColor)(this._THREEObject3D.color, newProps.skyColor);
	    }

	    this.transferTHREEObject3DPropsByName(oldProps, newProps, ['groundColor', 'intensity']);
	  }
	});

	exports['default'] = THREEHemisphereLight;
	module.exports = exports['default'];

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);
	var createTHREEComponent = __webpack_require__(23).createTHREEComponent;
	var THREEObject3DMixin = __webpack_require__(19);
	var LightObjectMixin = __webpack_require__(71);

	var CommonShadowmapProps = __webpack_require__(75);

	var THREESpotLight = createTHREEComponent('SpotLight', THREEObject3DMixin, {
	    createTHREEObject: function createTHREEObject() {
	        return new THREE.SpotLight(0xffffff, 1);
	    },

	    applySpecificTHREEProps: function applySpecificTHREEProps(oldProps, newProps) {
	        LightObjectMixin.applySpecificTHREEProps.call(this, oldProps, newProps);

	        this.transferTHREEObject3DPropsByName(oldProps, newProps, CommonShadowmapProps);
	        this.transferTHREEObject3DPropsByName(oldProps, newProps, ['target', 'intensity', 'distance', 'angle', 'exponent', 'castShadow', 'onlyShadow', 'shadowCameraFov']);
	    }
	});

	module.exports = THREESpotLight;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var THREE = __webpack_require__(14);

	module.exports = {

	    X_AXIS: new THREE.Vector3(1, 0, 0),
	    Y_AXIS: new THREE.Vector3(0, 1, 0),
	    Z_AXIS: new THREE.Vector3(0, 0, 1)

	};

/***/ }
/******/ ]);