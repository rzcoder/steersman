import { IRouteTemplate, IRouteMapper, IRouteParser, IRouteResolver, IRouteConstructable, MappingFunction } from "./types";
export declare class RouteResolver implements IRouteResolver {
    private _name;
    private _routeClass;
    readonly name: string;
    readonly routeClass: IRouteConstructable;
    constructor();
    as(name: string): IRouteResolver;
    to(route: IRouteConstructable): IRouteResolver;
}
/**
 * Make flat array of routes from an router mapping
 */
export declare class RouteMapper implements IRouteMapper {
    private parser;
    constructor(parser: IRouteParser);
    mapping(mappingFn: MappingFunction): IRouteTemplate[];
    private makeRouteRegexp(template);
    private matcher(base, path, innerMapping);
}
