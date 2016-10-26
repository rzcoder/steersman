"use strict";
var Route = (function () {
    function Route(parameters, routeInfo) {
        this.parameters = parameters;
        this.routeInfo = routeInfo;
    }
    Route.prototype.beforeExit = function (newRoute) {
        return;
    };
    Route.prototype.beforeEnter = function () {
        return;
    };
    Route.prototype.onExit = function (newRoute) {
        return;
    };
    Route.prototype.onEnter = function () {
        return;
    };
    Route.prototype.onCancelEnterTransition = function (reason) {
    };
    Route.prototype.onCancelExitTransition = function (reason) {
    };
    ;
    return Route;
}());
exports.Route = Route;
