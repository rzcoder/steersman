"use strict";
var HashHistory = (function () {
    function HashHistory(onNavigate) {
        this.onNavigate = onNavigate;
        throw new Error("Not implemented");
    }
    HashHistory.prototype.setPath = function (path, replace) {
    };
    HashHistory.prototype.goBack = function () {
    };
    HashHistory.prototype.goForward = function () {
    };
    return HashHistory;
}());
exports.HashHistory = HashHistory;
