"use strict";
var VirtualHistory = (function () {
    function VirtualHistory(onNavigate) {
        this.history = [];
        this.currentPosition = -1;
        this.onNavigate = onNavigate;
    }
    Object.defineProperty(VirtualHistory.prototype, "currentPath", {
        get: function () {
            if (this.currentPosition >= 0 && this.currentPosition < this.history.length) {
                return this.history[this.currentPosition];
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    VirtualHistory.prototype.setPath = function (path, replace) {
        if (this.currentPosition >= 0 && this.currentPosition < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentPosition + 1);
        }
        if (replace) {
            this.history[this.currentPosition] = path;
        }
        else {
            this.history.push(path);
            this.currentPosition = this.history.length - 1;
        }
    };
    VirtualHistory.prototype.goBack = function () {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            if (this.onNavigate) {
                this.onNavigate(this.currentPath);
            }
        }
    };
    VirtualHistory.prototype.goForward = function () {
        if (this.currentPosition >= 0 && this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            if (this.onNavigate) {
                this.onNavigate(this.currentPath);
            }
        }
    };
    VirtualHistory.prototype.start = function () {
    };
    VirtualHistory.prototype.stop = function () {
    };
    return VirtualHistory;
}());
exports.VirtualHistory = VirtualHistory;
