import {
    IRoute,
    IRouteParameters,
    IRouteInfo,
    IRouteTransitionResult,
    IRouteCancelableTransitionResult
} from "./types";

export class Route implements IRoute {
    public parameters: IRouteParameters;
    public routeInfo: IRouteInfo;

    constructor(parameters: IRouteParameters, routeInfo: IRouteInfo) {
        this.parameters = parameters;
        this.routeInfo = routeInfo;
    }

    beforeExit(newRoute: IRoute): Promise<IRouteCancelableTransitionResult> { // tslint:disable-line
        return Promise.resolve({});
    }

    beforeEnter(): Promise<IRouteCancelableTransitionResult> {
        return Promise.resolve({});
    }

    onExit(newRoute: IRoute): Promise<IRouteTransitionResult> { // tslint:disable-line
        return Promise.resolve({});
    }

    onEnter(): Promise<IRouteTransitionResult> {
        return Promise.resolve({});
    }

    onCancelEnterTransition(reason: Error): void { // tslint:disable-line
    }

    onCancelExitTransition(reason: Error): void { // tslint:disable-line
    };
}
