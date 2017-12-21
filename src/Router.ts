import * as utils from "./utils";

import {
    IRouter,
    IRoute,
    IHistory,
    IRouteParameters,
    IRouteTemplate,
    IRouteParser,
    IRouteMapper,
    ITransitor,
    RouterContext,
    MappingFunction,
    IRouterOptions,
    IRouterNavigateOptions
} from "./types";

import {
    TransitionError,
    CancellationError,
    InterceptedError,
    ReplacedError,
    RedirectedError
} from './Errors';

import {RouteParser} from "./Parser";
import {RouteMapper} from "./Mapper";
import {Transitor} from "./Transitor";

import {BrowserHistory} from "./history/BrowserHistory";
import {VirtualHistory} from "./history/VirtualHistory";
import {HashHistory} from "./history/HashHistory";

export {Route} from "./Route";
export {
    IRouter,
    IRoute,
    IRouteParameters,
    IRouterOptions,
    IRouterNavigateOptions,
    IRouteTransitionResult,
    IRouteCancelableTransitionResult,
    IRouteTransitionPromiseResult,
    IRouteCancelableTransitionPromiseResult
} from "./types";

export class Router implements IRouter {
    private options: IRouterOptions;
    private routes: IRouteTemplate[];
    private parser: IRouteParser;
    private mapper: IRouteMapper;
    private transitor: ITransitor;
    private history: IHistory;
    private _context: RouterContext;

    private _onNavigate: (oldUrl: string, newUrl: string) => void;

    public get currentRoute(): IRoute {
        return this.transitor.currentRoute;
    }

    public get inTransition(): boolean {
        return this.transitor.inTransition;
    }

    get context(): RouterContext {
        return this._context;
    }

    set context(value: RouterContext) {
        this._context = value;
    }

    get mapping(): IRouteTemplate[] {
        return this.routes;
    }

    get onNavigate(): (oldUrl: string, newUrl: string) => void {
        return this._onNavigate;
    }

    set onNavigate(value: (oldUrl: string, newUrl: string) => void) {
        this._onNavigate = value;
    }

    constructor(options: IRouterOptions = {}) {
        this.options = {
            historyProvider: options.historyProvider || "history",
            transitionStrategy: options.transitionStrategy || "wait"
        };
        this.context = options.context;
        this.routes = options.mapping || [];
        this.parser = new RouteParser();
        this.mapper = new RouteMapper(this.parser);
        this.transitor = new Transitor(this.options.transitionStrategy);

        switch (this.options.historyProvider) {
            case "virtual":
                this.history = new VirtualHistory(this.processPath.bind(this));
                break;
            case "hash":
                this.history = new HashHistory(this.processPath.bind(this));
                break;
            case "history":
                this.history = new BrowserHistory(this.processPath.bind(this));
                break;
        }
    }

    public map(mappingFn: MappingFunction): void {
        this.routes.push(...this.mapper.mapping(mappingFn));
    }

    public navigate(path: string, options: IRouterNavigateOptions = {}): Promise<void> {
        path = utils.normalizePath(path);

        const oldPath = this.history.currentPath;
        this.history.setPath(path, options.replace);

        let result;

        if (!options.silent) {
            result = this.processPath(path);
        } else {
            result = Promise.resolve();
        }

        return result.then(() => {
            if (this.onNavigate) {
                this.onNavigate(oldPath, path);
            }
        });
    }

    public goBack(options: IRouterNavigateOptions = {}) {
        this.history.goBack();

        const oldPath = this.history.currentPath;
        let result;

        if (!options.silent) {
            result = this.processPath(this.history.currentPath);
        } else {
            result = Promise.resolve();
        }

        return result.then(() => {
            if (this.onNavigate) {
                this.onNavigate(oldPath, this.history.currentPath);
            }
        });
    }

    private processPath(path: string): Promise<any> {
        for (let route of this.routes) {
            let result = path.match(route.regexp);
            if (result) {
                const params: IRouteParameters = {};
                for (let paramIndex = 0; paramIndex < route.parameters.length; paramIndex++) {
                    params[route.parameters[paramIndex]] = result[paramIndex + 1];
                }

                const routeConstructor = route.resolve.routeClass;
                const transition = this.transitor.transitionTo(new routeConstructor(params, {
                    template: route.template,
                    regexp: route.regexp,
                    path: path,
                    prevRoute: this.currentRoute,
                    context: this.context
                }));

                transition.promise.then((reason: Error) => {
                    if (reason) {
                        return;
                    }

                    if (reason instanceof RedirectedError) {
                        this.navigate(reason.redirectOptions.url, {
                            replace: reason.redirectOptions.replace
                        });
                    }
                });

                return transition.promise;
            }
        }
    }

    public testPath(path: string): boolean {
        for (let route of this.routes) {
            if (path.match(route.regexp)) {
                return true;
            }
        }
        return false;
    }
}