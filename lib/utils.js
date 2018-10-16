"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NORMALIZE_PATH_REGEXP = /^[\s\/]*(.*?)[\s\/]*$/i;
var InvalidPathError = (function (_super) {
    __extends(InvalidPathError, _super);
    function InvalidPathError() {
        _super.apply(this, arguments);
    }
    return InvalidPathError;
}(Error));
function normalizePath(path) {
    var match;
    if (typeof path !== "string" || !(match = path.match(NORMALIZE_PATH_REGEXP))) {
        throw new InvalidPathError("Invalid path string " + path);
    }
    return match[1];
}
exports.normalizePath = normalizePath;
