"use strict";
var Route = (function () {
    function Route(parameters, routeInfo) {
        this.parameters = parameters;
        this.routeInfo = routeInfo;
    }
    Route.prototype.beforeExit = function (newRoute) {
        return Promise.resolve({});
    };
    Route.prototype.beforeEnter = function () {
        return Promise.resolve({});
    };
    Route.prototype.onExit = function (newRoute) {
        return Promise.resolve({});
    };
    Route.prototype.onEnter = function () {
        return Promise.resolve({});
    };
    Route.prototype.onCancelEnterTransition = function (reason) {
    };
    Route.prototype.onCancelExitTransition = function (reason) {
    };
    ;
    return Route;
}());
exports.Route = Route;
