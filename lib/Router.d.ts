import { IRouter, IRoute, IRouteTemplate, RouterContext, MappingFunction, IRouterOptions, IRouterNavigateOptions } from "./types";
export { Route } from "./Route";
export { IRouter, IRoute, IRouteParameters, IRouterOptions, IRouterNavigateOptions, IRouteTransitionResult, IRouteCancelableTransitionResult, IRouteTransitionPromiseResult, IRouteCancelableTransitionPromiseResult } from "./types";
export declare class Router implements IRouter {
    private options;
    private routes;
    private parser;
    private mapper;
    private transitor;
    private history;
    private _context;
    private _onNavigate;
    readonly currentRoute: IRoute;
    readonly inTransition: boolean;
    context: RouterContext;
    readonly mapping: IRouteTemplate[];
    onNavigate: (oldUrl: string, newUrl: string) => void;
    constructor(options?: IRouterOptions);
    map(mappingFn: MappingFunction): void;
    navigate(path: string, options?: IRouterNavigateOptions): Promise<void>;
    private processPath(path);
    testPath(path: string): boolean;
}
