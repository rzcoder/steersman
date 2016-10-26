"use strict";
var types_1 = require("./types");
var Errors_1 = require('./Errors');
var Transition = (function () {
    function Transition(parent, newRoute, start) {
        var _this = this;
        this.parent = parent;
        this._state = types_1.TransitionState.Waiting;
        this._newRoute = newRoute;
        this._canceled = false;
        this._promise = new Promise(function (resolve, reject) {
            _this._promiseResolve = resolve;
            _this._promiseReject = reject;
        });
        if (start) {
            this.start();
        }
    }
    Object.defineProperty(Transition.prototype, "oldRoute", {
        get: function () {
            return this._oldRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "newRoute", {
        get: function () {
            return this._newRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "inProgress", {
        get: function () {
            return this.state === types_1.TransitionState.Started ||
                this.state === types_1.TransitionState.InNewRoute ||
                this.state === types_1.TransitionState.InOldRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "canceled", {
        get: function () {
            return !!this._canceled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "promise", {
        get: function () {
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Transition.prototype.interceptTransition = function (transitionResult) {
        if (this.canceled) {
            if (this.inProgress && this.state !== types_1.TransitionState.Started) {
                throw new Errors_1.InterceptedError("Intercepted: " + this._canceled);
            }
            else {
                throw new Errors_1.ReplacedError("Replaced: " + this._canceled);
            }
        }
        if (!transitionResult) {
            return;
        }
        if (transitionResult.canceled) {
            throw new Errors_1.CancellationError("Canceled by route");
        }
        if (transitionResult.redirected) {
            throw new Errors_1.RedirectedError("Redirected by route");
        }
    };
    Transition.prototype.start = function () {
        var _this = this;
        this._state = types_1.TransitionState.Started;
        Promise.resolve().then(function () {
            /* Before Exit */
            _this.interceptTransition();
            if (_this.parent) {
                _this._oldRoute = _this.parent.currentRoute;
            }
            _this._state = types_1.TransitionState.InOldRoute;
            return _this.oldRoute ? _this.oldRoute.beforeExit(_this.newRoute) : Promise.resolve({});
        }).then(function (transitionResult) {
            /* Before Enter */
            _this.interceptTransition(transitionResult);
            return _this.newRoute.beforeEnter();
        }).then(function (transitionResult) {
            /* On Exit */
            _this.interceptTransition(transitionResult);
            return _this.oldRoute ? _this.oldRoute.onExit(_this.newRoute) : Promise.resolve({});
        }).then(function (transitionResult) {
            /* On Enter */
            _this.interceptTransition(transitionResult);
            _this._state = types_1.TransitionState.InNewRoute;
            return _this.newRoute.onEnter();
        }).then(function (transitionResult) {
            /* After Enter */
            _this.interceptTransition(transitionResult);
            _this._state = types_1.TransitionState.Ended;
            _this._promiseResolve();
        }).catch(function (e) {
            if (e instanceof Errors_1.ReplacedError) {
                _this._state = types_1.TransitionState.Replaced;
                _this.newRoute.onCancelEnterTransition(e);
                _this._promiseReject(e);
            }
            else if (e instanceof Errors_1.InterceptedError) {
                _this._state = types_1.TransitionState.Intercepted;
                if (_this.state === types_1.TransitionState.InOldRoute && _this.oldRoute) {
                    _this.oldRoute.onCancelExitTransition(e);
                }
                _this.newRoute.onCancelEnterTransition(e);
                _this._promiseReject(e);
            }
            else if (e instanceof Errors_1.CancellationError) {
                _this._state = types_1.TransitionState.Cancelled;
                if (_this.state === types_1.TransitionState.InOldRoute && _this.oldRoute) {
                    _this.oldRoute.onCancelExitTransition(e);
                }
                _this.newRoute.onCancelEnterTransition(e);
                _this._promiseReject(e);
            }
            else if (e instanceof Errors_1.RedirectedError) {
                _this._state = types_1.TransitionState.Redirected;
                if (_this.state === types_1.TransitionState.InOldRoute && _this.oldRoute) {
                    _this.oldRoute.onCancelExitTransition(e);
                }
                _this.newRoute.onCancelEnterTransition(e);
                _this._promiseReject(e);
            }
            else {
                _this._promiseReject(e);
                throw e;
            }
        });
    };
    Transition.prototype.cancel = function (reason) {
        this._canceled = reason;
    };
    return Transition;
}());
var Transitor = (function () {
    function Transitor(conflictStrategy) {
        this.transitionsQueue = [];
        this.conflictStrategy = conflictStrategy;
    }
    Object.defineProperty(Transitor.prototype, "currentRoute", {
        get: function () {
            return this._currentRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transitor.prototype, "inTransition", {
        get: function () {
            return !!(this.transitionsQueue[0] && this.transitionsQueue[0].inProgress);
        },
        enumerable: true,
        configurable: true
    });
    Transitor.prototype.shiftQueue = function () {
        if (!this.transitionsQueue[1]) {
            return;
        }
        this.transitionsQueue[0] = this.transitionsQueue[1];
        this.transitionsQueue[1] = undefined;
        this.transitionsQueue[0].start();
    };
    Transitor.prototype.transitionTo = function (route) {
        var _this = this;
        var transition;
        if (!this.inTransition) {
            transition = new Transition(this, route, true);
            this.transitionsQueue[0] = transition;
        }
        else {
            switch (this.conflictStrategy) {
                case "cancelnew":
                    transition = new Transition(this, route, true);
                    transition.cancel("Already in transition");
                    break;
                case "cancelold":
                    this.transitionsQueue[0].cancel("Replaced by the new transition");
                    this.transitionsQueue[0] = transition = new Transition(this, route, true);
                    break;
                case "notransition":
                    transition = new Transition(null, route, true);
                    break;
                case "wait":
                    if (this.transitionsQueue[1]) {
                        this.transitionsQueue[1].start();
                        this.transitionsQueue[1].cancel("Replaced by the new transition");
                    }
                    else {
                        this.transitionsQueue[0].promise.then(this.shiftQueue.bind(this), this.shiftQueue.bind(this));
                    }
                    this.transitionsQueue[1] = transition = new Transition(this, route, false);
                    break;
            }
        }
        if (this.conflictStrategy !== "notransition") {
            transition.promise.then(function () {
                _this._currentRoute = transition.newRoute;
                _this.transitionsQueue[0] = undefined;
            });
        }
        return transition;
    };
    return Transitor;
}());
exports.Transitor = Transitor;
