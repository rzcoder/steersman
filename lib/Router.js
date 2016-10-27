"use strict";
var utils = require("./utils");
var Errors_1 = require('./Errors');
var Parser_1 = require("./Parser");
var Mapper_1 = require("./Mapper");
var Transitor_1 = require("./Transitor");
var BrowserHistory_1 = require("./history/BrowserHistory");
var VirtualHistory_1 = require("./history/VirtualHistory");
var HashHistory_1 = require("./history/HashHistory");
var Route_1 = require("./Route");
exports.Route = Route_1.Route;
var Router = (function () {
    function Router(options) {
        if (options === void 0) { options = {}; }
        this.options = {
            historyProvider: options.historyProvider || "history",
            transitionStrategy: options.transitionStrategy || "wait"
        };
        this.context = options.context;
        this.routes = options.mapping || [];
        this.parser = new Parser_1.RouteParser();
        this.mapper = new Mapper_1.RouteMapper(this.parser);
        this.transitor = new Transitor_1.Transitor(this.options.transitionStrategy);
        switch (this.options.historyProvider) {
            case "virtual":
                this.history = new VirtualHistory_1.VirtualHistory(this.processPath.bind(this));
                break;
            case "hash":
                this.history = new HashHistory_1.HashHistory(this.processPath.bind(this));
                break;
            case "history":
                this.history = new BrowserHistory_1.BrowserHistory(this.processPath.bind(this));
                break;
        }
    }
    Object.defineProperty(Router.prototype, "currentRoute", {
        get: function () {
            return this.transitor.currentRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "inTransition", {
        get: function () {
            return this.transitor.inTransition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (value) {
            this._context = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "mapping", {
        get: function () {
            return this.routes;
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.map = function (mappingFn) {
        (_a = this.routes).push.apply(_a, this.mapper.mapping(mappingFn));
        var _a;
    };
    Router.prototype.navigate = function (path, options) {
        if (options === void 0) { options = {}; }
        path = utils.normalizePath(path);
        this.history.setPath(path, options.replace);
        if (!options.silent) {
            return this.processPath(path);
        }
        return Promise.resolve();
    };
    Router.prototype.processPath = function (path) {
        var _this = this;
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            var result = path.match(route.regexp);
            if (result) {
                var params = {};
                for (var paramIndex = 0; paramIndex < route.parameters.length; paramIndex++) {
                    params[route.parameters[paramIndex]] = result[paramIndex + 1];
                }
                var routeConstructor = route.resolve.routeClass;
                var transition = this.transitor.transitionTo(new routeConstructor(params, {
                    template: route.template,
                    regexp: route.regexp,
                    path: path,
                    prevRoute: this.currentRoute,
                    context: this.context
                }));
                transition.promise.then(function (reason) {
                    if (reason) {
                        return;
                    }
                    if (reason instanceof Errors_1.RedirectedError) {
                        _this.navigate(reason.redirectOptions.url, {
                            replace: reason.redirectOptions.replace
                        });
                    }
                });
                return transition.promise;
            }
        }
    };
    return Router;
}());
exports.Router = Router;
