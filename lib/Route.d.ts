import { IRoute, IRouteParameters, IRouteInfo, IRouteTransitionResult, IRouteCancelableTransitionResult } from "./types";
export declare class Route implements IRoute {
    parameters: IRouteParameters;
    routeInfo: IRouteInfo;
    constructor(parameters: IRouteParameters, routeInfo: IRouteInfo);
    beforeExit(newRoute: IRoute): Promise<IRouteCancelableTransitionResult>;
    beforeEnter(): Promise<IRouteCancelableTransitionResult>;
    onExit(newRoute: IRoute): Promise<IRouteTransitionResult>;
    onEnter(): Promise<IRouteTransitionResult>;
    onCancelEnterTransition(reason: Error): void;
    onCancelExitTransition(reason: Error): void;
}
