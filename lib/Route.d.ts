import { IRoute, IRouteParameters, IRouteInfo, IRouteTransitionPromiseResult, IRouteCancelableTransitionPromiseResult } from "./types";
export declare class Route implements IRoute {
    parameters: IRouteParameters;
    routeInfo: IRouteInfo;
    constructor(parameters: IRouteParameters, routeInfo: IRouteInfo);
    beforeExit(newRoute: IRoute): IRouteCancelableTransitionPromiseResult;
    beforeEnter(): IRouteCancelableTransitionPromiseResult;
    onExit(newRoute: IRoute): IRouteTransitionPromiseResult;
    onEnter(): IRouteTransitionPromiseResult;
    onCancelEnterTransition(reason: Error): void;
    onCancelExitTransition(reason: Error): void;
}
