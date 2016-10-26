"use strict";
var utils = require("./utils");
var ESCAPED_SYMBOLS = /[.,?\^$\-{}\[\]+\\|#\s]/g;
var TEMPLATE_REGEXP = /(:[\w_]+|\*[\w_]+|[^*:]+)/g;
/**
 * Parse an template route string to regexp + parameters names
 */
var RouteParser = (function () {
    function RouteParser() {
    }
    RouteParser.prototype.parse = function (template) {
        var result = {
            template: "",
            parameters: []
        };
        template = utils.normalizePath(template).replace(ESCAPED_SYMBOLS, "\\$&");
        result.template = template.replace(TEMPLATE_REGEXP, function (chunk) {
            if (chunk[0] === ":") {
                result.parameters.push(chunk.slice(1));
                return "([^\/]+)";
            }
            else if (chunk[0] === "*") {
                result.parameters.push(chunk.slice(1));
                return "(.*?)";
            }
            return chunk;
        });
        return result;
    };
    return RouteParser;
}());
exports.RouteParser = RouteParser;
