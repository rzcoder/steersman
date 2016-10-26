/* Router */
"use strict";
/* Transitor */
(function (TransitionState) {
    TransitionState[TransitionState["Waiting"] = 0] = "Waiting";
    TransitionState[TransitionState["Started"] = 1] = "Started";
    TransitionState[TransitionState["InOldRoute"] = 2] = "InOldRoute";
    TransitionState[TransitionState["InNewRoute"] = 3] = "InNewRoute";
    TransitionState[TransitionState["Replaced"] = 4] = "Replaced";
    TransitionState[TransitionState["Intercepted"] = 5] = "Intercepted";
    TransitionState[TransitionState["Cancelled"] = 6] = "Cancelled";
    TransitionState[TransitionState["Redirected"] = 7] = "Redirected";
    TransitionState[TransitionState["Ended"] = 8] = "Ended"; // transition successfully ended
})(exports.TransitionState || (exports.TransitionState = {}));
var TransitionState = exports.TransitionState;
