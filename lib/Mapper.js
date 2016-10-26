"use strict";
var RouteResolver = (function () {
    function RouteResolver() {
        this._routeClass = null;
    }
    Object.defineProperty(RouteResolver.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteResolver.prototype, "routeClass", {
        get: function () {
            return this._routeClass;
        },
        enumerable: true,
        configurable: true
    });
    RouteResolver.prototype.as = function (name) {
        this._name = name;
        return this;
    };
    RouteResolver.prototype.to = function (route) {
        this._routeClass = route;
        return this;
    };
    return RouteResolver;
}());
exports.RouteResolver = RouteResolver;
/**
 * Make flat array of routes from an router mapping
 */
var RouteMapper = (function () {
    function RouteMapper(parser) {
        if (!parser) {
            throw new Error("No parser object passed");
        }
        this.parser = parser;
    }
    RouteMapper.prototype.mapping = function (mappingFn) {
        if (!mappingFn || typeof mappingFn !== "function") {
            throw new Error("No mapping function passed");
        }
        var routes = [];
        var matcher = this.matcher.bind(this, routes);
        mappingFn(matcher);
        return routes;
    };
    RouteMapper.prototype.makeRouteRegexp = function (template) {
        return new RegExp("^" + template + "$", "i");
    };
    RouteMapper.prototype.matcher = function (base, path, innerMapping) {
        var extensions = [];
        if (innerMapping) {
            innerMapping(this.matcher.bind(this, extensions));
        }
        var _a = this.parser.parse(path), template = _a.template, parameters = _a.parameters;
        var result = [];
        var resolve = null;
        if (extensions.length > 0) {
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                var fullTemplate = template + (extension.template !== "" ? "/" + extension.template : "");
                result.push({
                    template: fullTemplate,
                    regexp: this.makeRouteRegexp(fullTemplate),
                    parameters: parameters.concat(extension.parameters),
                    resolve: extension.resolve
                });
            }
        }
        else {
            resolve = new RouteResolver();
            result.push({
                template: template,
                regexp: this.makeRouteRegexp(template),
                parameters: parameters,
                resolve: resolve
            });
        }
        base.push.apply(base, result);
        return resolve;
    };
    return RouteMapper;
}());
exports.RouteMapper = RouteMapper;
