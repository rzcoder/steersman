/**
 * history (default): Used history `pushState`/`popState` api.
 * hash: Used hash & `hashchange` event.
 * virtual: Virtual history. Not produce any changes in real browser history.
 */
export declare type HistoryProvider = "history" | "hash" | "virtual";
export interface IRouterOptions {
    transitionStrategy?: TransitionConflictStrategy;
    historyProvider?: HistoryProvider;
    context?: RouterContext;
    mapping?: IRouteTemplate[];
}
export interface IRouterNavigateOptions {
    silent?: boolean;
    replace?: boolean;
}
export declare type RouterContext = any;
export interface IRouter {
    context: RouterContext;
    currentRoute: IRoute;
    inTransition: boolean;
    mapping: IRouteTemplate[];
    map(mappingFn: MappingFunction): void;
    navigate(path: string): Promise<void>;
}
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
export declare type IRouteTransitionPromiseResult = Promise<IRouteTransitionResult> | undefined;
export declare type IRouteCancelableTransitionPromiseResult = Promise<IRouteCancelableTransitionResult> | undefined;
export interface IRoute {
    beforeExit(newRoute: IRoute): IRouteCancelableTransitionPromiseResult;
    beforeEnter(): IRouteCancelableTransitionPromiseResult;
    onExit(newRoute: IRoute): IRouteTransitionPromiseResult;
    onEnter(): IRouteTransitionPromiseResult;
    onCancelEnterTransition(reason: Error): void;
    onCancelExitTransition(reason: Error): void;
}
export declare type MappingFunction = Function;
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
export interface IRouteParseResult {
    template: string;
    parameters: Array<string>;
}
export interface IRouteParser {
    parse(template: string): IRouteParseResult;
}
export declare enum TransitionState {
    Waiting = 0,
    Started = 1,
    InOldRoute = 2,
    InNewRoute = 3,
    Replaced = 4,
    Intercepted = 5,
    Cancelled = 6,
    Redirected = 7,
    Ended = 8,
}
export interface ITransition {
    oldRoute: IRoute;
    newRoute: IRoute;
    inProgress: boolean;
    promise: Promise<void>;
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
export declare type RouteTransitionResult = IRouteTransitionResult | IRouteCancelableTransitionResult;
export declare type TransitionConflictStrategy = "wait" | "cancelold" | "cancelnew" | "notransition";
export interface ITransitor {
    currentRoute: IRoute;
    inTransition: boolean;
    transitionTo(route: IRoute): ITransition;
}
export interface IHistoryNavigateEvent {
    (newPath: string): void;
}
export interface IHistory {
    currentPath: string;
    setPath(path: string, replace: boolean): void;
    goBack(): void;
    goForward(): void;
}
