import {
    IRoute,
    IRouteParameters,
    IRouteInfo,
    IRouteTransitionPromiseResult,
    IRouteCancelableTransitionPromiseResult
} from "./types";

export class Route implements IRoute {
    public parameters: IRouteParameters;
    public routeInfo: IRouteInfo;

    constructor(parameters: IRouteParameters, routeInfo: IRouteInfo) {
        this.parameters = parameters;
        this.routeInfo = routeInfo;
    }

    beforeExit(newRoute: IRoute): IRouteCancelableTransitionPromiseResult { // tslint:disable-line
        return;
    }

    beforeEnter(): IRouteCancelableTransitionPromiseResult {
        return;
    }

    onExit(newRoute: IRoute): IRouteTransitionPromiseResult { // tslint:disable-line
        return;
    }

    onEnter(): IRouteTransitionPromiseResult {
        return;
    }

    onCancelEnterTransition(reason: Error): void { // tslint:disable-line
    }

    onCancelExitTransition(reason: Error): void { // tslint:disable-line
    };
}
