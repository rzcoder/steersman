"use strict";
var HashHistory = (function () {
    function HashHistory(onNavigate) {
        this.onNavigate = onNavigate;
    }
    Object.defineProperty(HashHistory.prototype, "currentPath", {
        get: function () {
            return location.pathname;
        },
        enumerable: true,
        configurable: true
    });
    HashHistory.prototype.navigate = function (e, path) {
        if (this.started) {
            this.onNavigate(path || this.currentPath);
        }
    };
    HashHistory.prototype.setPath = function (path, replace) {
        if (replace) {
            var href = location.href.replace(/#.*$/, "");
            location.replace(href + "#" + path);
        }
        else {
            window.location.hash = "#" + path;
        }
    };
    HashHistory.prototype.goBack = function () {
        history.back();
        return true;
    };
    HashHistory.prototype.goForward = function () {
        history.forward();
        return true;
    };
    HashHistory.prototype.start = function () {
        this.started = true;
        addEventListener("hashchange", this.navigate, false);
    };
    HashHistory.prototype.stop = function () {
        this.started = false;
        removeEventListener("hashchange", this.navigate, false);
    };
    return HashHistory;
}());
exports.HashHistory = HashHistory;
