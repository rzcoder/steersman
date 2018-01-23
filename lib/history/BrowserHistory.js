"use strict";
var BrowserHistory = (function () {
    function BrowserHistory(onNavigate) {
        this.onNavigate = onNavigate;
    }
    Object.defineProperty(BrowserHistory.prototype, "currentPath", {
        get: function () {
            return location.pathname;
        },
        enumerable: true,
        configurable: true
    });
    BrowserHistory.prototype.navigate = function (e, path) {
        this.onNavigate(path || this.currentPath);
    };
    BrowserHistory.prototype.setPath = function (path, replace) {
        if (replace) {
            history.pushState(null, null, path);
        }
        else {
            history.replaceState(null, null, path);
        }
    };
    BrowserHistory.prototype.goBack = function () {
        history.back();
        return true;
    };
    BrowserHistory.prototype.goForward = function () {
        history.forward();
        return true;
    };
    BrowserHistory.prototype.start = function () {
        this.started = true;
        addEventListener("popstate", this.navigate, false);
    };
    BrowserHistory.prototype.stop = function () {
        this.started = false;
        removeEventListener("popstate", this.navigate, false);
    };
    return BrowserHistory;
}());
exports.BrowserHistory = BrowserHistory;
