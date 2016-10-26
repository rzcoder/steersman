import {
    IRouteTemplate,
    IRouteMapper,
    IRouteParser,
    IRouteResolver,
    IRouteConstructable,
    MappingFunction
} from "./types";

export class RouteResolver implements IRouteResolver {
    private _name: string;
    private _routeClass: IRouteConstructable;

    get name(): string {
        return this._name;
    }

    get routeClass(): IRouteConstructable {
        return this._routeClass;
    }

    constructor() {
        this._routeClass = null;
    }

    as(name: string): IRouteResolver {
        this._name = name;
        return this;
    }

    to(route: IRouteConstructable): IRouteResolver {
        this._routeClass = route;
        return this;
    }
}

/**
 * Make flat array of routes from an router mapping
 */
export class RouteMapper implements IRouteMapper {
    private parser: IRouteParser;

    constructor(parser: IRouteParser) {
        if (!parser) {
            throw new Error("No parser object passed");
        }
        this.parser = parser;
    }

    public mapping(mappingFn: MappingFunction): IRouteTemplate[] {
        if (!mappingFn || typeof mappingFn !== "function") {
            throw new Error("No mapping function passed");
        }

        const routes: IRouteTemplate[] = [];
        const matcher = this.matcher.bind(this, routes);
        mappingFn(matcher);

        return routes;
    }

    private makeRouteRegexp(template: string): RegExp {
        return new RegExp("^" + template + "$", "i");
    }

    private matcher(base: IRouteTemplate[], path: string, innerMapping: MappingFunction): RouteResolver {
        const extensions = [];

        if (innerMapping) {
            innerMapping(this.matcher.bind(this, extensions));
        }

        const {template, parameters} = this.parser.parse(path);

        const result = [];
        let resolve = null;

        if (extensions.length > 0) {
            for (let extension of extensions) {
                const fullTemplate = template + (extension.template !== "" ? `\/` + extension.template : "");
                result.push({
                    template: fullTemplate,
                    regexp: this.makeRouteRegexp(fullTemplate),
                    parameters: parameters.concat(extension.parameters),
                    resolve: extension.resolve
                });
            }
        } else {
            resolve = new RouteResolver();
            result.push({
                template,
                regexp: this.makeRouteRegexp(template),
                parameters,
                resolve
            });
        }

        base.push(...result);
        return resolve;
    }
}