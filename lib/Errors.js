"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TransitionError = (function (_super) {
    __extends(TransitionError, _super);
    function TransitionError(message) {
        _super.call(this);
        this.message = message;
    }
    return TransitionError;
}(Error));
exports.TransitionError = TransitionError;
var CancellationError = (function (_super) {
    __extends(CancellationError, _super);
    function CancellationError(message) {
        _super.call(this);
        this.message = message;
    }
    return CancellationError;
}(Error));
exports.CancellationError = CancellationError;
var InterceptedError = (function (_super) {
    __extends(InterceptedError, _super);
    function InterceptedError(message) {
        _super.call(this);
        this.message = message;
    }
    return InterceptedError;
}(Error));
exports.InterceptedError = InterceptedError;
var ReplacedError = (function (_super) {
    __extends(ReplacedError, _super);
    function ReplacedError(message) {
        _super.call(this);
        this.message = message;
    }
    return ReplacedError;
}(Error));
exports.ReplacedError = ReplacedError;
var RedirectedError = (function (_super) {
    __extends(RedirectedError, _super);
    function RedirectedError(message) {
        _super.call(this);
        this.message = message;
    }
    return RedirectedError;
}(Error));
exports.RedirectedError = RedirectedError;
