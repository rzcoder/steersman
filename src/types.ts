/* Router */

/**
 * history (default): Used history `pushState`/`popState` api.
 * hash: Used hash & `hashchange` event.
 * virtual: Virtual history. Not produce any changes in real browser history.
 */
export type HistoryProvider = "history" | "hash" | "virtual";

export interface IRouterOptions {
    transitionStrategy?: TransitionConflictStrategy;
    historyProvider?: HistoryProvider;
    context?: RouterContext;
    mapping?: IRouteTemplate[];
}

export interface IRouterNavigateOptions {
    silent?: boolean; // Not produce new route, only change URL (browser mode)
    replace?: boolean; // Update URL without creating an entry in the history interface
}

export type RouterContext = any;

export interface IRouter {
    context: RouterContext;
    currentRoute: IRoute;
    inTransition: boolean;
    mapping: IRouteTemplate[];
    map(mappingFn: MappingFunction): void;
    navigate(path: string): Promise<void>;
    testPath(path: string): boolean;
}

/* Route */

export interface IRouteInfo {
    template: string;
    regexp: RegExp;
    path: string;
    prevRoute: IRoute;
    context?: RouterContext;
}

export interface IRouteParameters {
    [key: string]: string;
}

export interface IRouteConstructable {
    new (parameters: IRouteParameters, routeInfo: IRouteInfo): IRoute;
}

export type IRouteTransitionPromiseResult = Promise<IRouteTransitionResult> | undefined;

export type IRouteCancelableTransitionPromiseResult = Promise<IRouteCancelableTransitionResult> | undefined;

export interface IRoute {
    parameters: IRouteParameters;
    routeInfo: IRouteInfo;
    beforeExit(newRoute: IRoute): IRouteCancelableTransitionPromiseResult;
    beforeEnter(): IRouteCancelableTransitionPromiseResult;
    onExit(newRoute: IRoute): IRouteTransitionPromiseResult;
    onEnter(): IRouteTransitionPromiseResult;
    onCancelEnterTransition(reason: Error): void;
    onCancelExitTransition(reason: Error): void;
}

/* Mapper */

export type MappingFunction = Function;

export interface IRouteResolver {
    name: string;
    routeClass: IRouteConstructable;
    as(name: string): IRouteResolver;
    to(route: IRouteConstructable): IRouteResolver;
}

export interface IRouteTemplate {
    template: string;
    regexp: RegExp;
    parameters: string[];
    resolve: IRouteResolver;
}

export interface IRouteMapper {
    mapping(mappingFn: MappingFunction): IRouteTemplate[];
}

/* Parser */

export interface IRouteParseResult {
    template: string;
    parameters: Array<string>;
}

export interface IRouteParser {
    parse(template: string): IRouteParseResult;
}

/* Transitor */

export enum TransitionState {
    Waiting, // not started yet
    Started, // just started
    InOldRoute, // started, in old route
    InNewRoute, // started, in new route
    Replaced, // not started, canceled by an new transition
    Intercepted, // started, canceled by an new transition
    Cancelled, // transition canceled by old or new route
    Redirected, // transition canceled and redirected to an new url by old or new route
    Ended // transition successfully ended
}

export interface ITransition {
    oldRoute: IRoute;
    newRoute: IRoute;
    inProgress: boolean;
    promise: Promise<Error>;
    start(): void;
    cancel(reason: string): void;
}

export interface IRouteTransitionRedirectOptions {
    /** New URL */
    url: string;
    /** Update the URL without creating an entry in the browser"s history */
    replace?: boolean;
}

export interface IRouteTransitionResult {
    redirected?: IRouteTransitionRedirectOptions;
}

export interface IRouteCancelableTransitionResult extends IRouteTransitionResult {
    canceled?: boolean;
}

export type RouteTransitionResult = IRouteTransitionResult | IRouteCancelableTransitionResult;

export type TransitionConflictStrategy = "wait" | "cancelold" | "cancelnew" | "notransition";

export interface ITransitor {
    currentRoute: IRoute;
    inTransition: boolean;
    transitionTo(route: IRoute): ITransition;
}

/* History */
export interface IHistoryNavigateEvent {
    (newPath: string): void;
}

export interface IHistory {
    currentPath: string;
    setPath(path: string, replace: boolean): void;
    goBack(): boolean;
    goForward(): boolean;
    start(): void;
    stop(): void;
}
