"use strict";
var BrowserHistory = (function () {
    function BrowserHistory(onNavigate) {
        this.onNavigate = onNavigate;
        throw new Error("Not implemented");
    }
    BrowserHistory.prototype.setPath = function (path, replace) {
    };
    BrowserHistory.prototype.goBack = function () {
    };
    BrowserHistory.prototype.goForward = function () {
    };
    return BrowserHistory;
}());
exports.BrowserHistory = BrowserHistory;
