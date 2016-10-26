import { IRouter, IRoute, IRouteTemplate, RouterContext, MappingFunction, IRouterOptions, IRouterNavigateOptions } from "./types";
export { Route } from "./Route";
export declare class Router implements IRouter {
    private options;
    private routes;
    private parser;
    private mapper;
    private transitor;
    private history;
    private _context;
    readonly currentRoute: IRoute;
    readonly inTransition: boolean;
    context: RouterContext;
    readonly mapping: IRouteTemplate[];
    constructor(options?: IRouterOptions);
    map(mappingFn: MappingFunction): void;
    navigate(path: string, options?: IRouterNavigateOptions): Promise<void>;
    private processPath(path);
}
