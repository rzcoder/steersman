import {
    IRoute,
    IRouteTransitionResult,
    IRouteCancelableTransitionResult,
    RouteTransitionResult,
    IRouteTransitionRedirectOptions,
    IRouteTemplate,
    IRouteParser,
    IRouteConstructable,
    ITransitor,
    TransitionConflictStrategy,
    ITransition,
    TransitionState
} from "./types";

import {
    TransitionError,
    CancellationError,
    InterceptedError,
    ReplacedError,
    RedirectedError
} from './Errors';

class Transition implements ITransition {
    private parent: ITransitor;
    private _oldRoute: IRoute;
    private _newRoute: IRoute;
    private _state: TransitionState;
    private _canceled: string | boolean;
    private _promise: Promise<void>;
    private _promiseResolve: () => void;
    private _promiseReject: (reason: any) => void;

    get oldRoute(): IRoute {
        return this._oldRoute;
    }

    get newRoute(): IRoute {
        return this._newRoute;
    }

    get state(): TransitionState {
        return this._state;
    }

    get inProgress(): boolean {
        return this.state === TransitionState.Started ||
            this.state === TransitionState.InNewRoute ||
            this.state === TransitionState.InOldRoute;
    }

    get canceled(): boolean {
        return !!this._canceled;
    }

    get promise(): Promise<void> {
        return this._promise;
    }

    constructor(parent: ITransitor, newRoute: IRoute, start: boolean) {
        this.parent = parent;
        this._state = TransitionState.Waiting;
        this._newRoute = newRoute;
        this._canceled = false;

        this._promise = new Promise((resolve, reject) => {
            this._promiseResolve = resolve;
            this._promiseReject = reject;
        });

        if (start) {
            this.start();
        }
    }

    private interceptTransition(transitionResult?: RouteTransitionResult) {
        if (this.canceled) {
            if (this.inProgress && this.state !== TransitionState.Started) {
                throw new InterceptedError("Intercepted: " + this._canceled);
            } else {
                throw new ReplacedError("Replaced: " + this._canceled);
            }
        }

        if (!transitionResult) {
            return;
        }

        if ((<IRouteCancelableTransitionResult>transitionResult).canceled) {
            throw new CancellationError("Canceled by route");
        }

        if (transitionResult.redirected) {
            throw new RedirectedError("Redirected by route", transitionResult.redirected);
        }
    }

    public start(): void {
        this._state = TransitionState.Started;

        Promise.resolve().then(() => {
            /* Before Exit */

            this.interceptTransition();
            if (this.parent) {
                this._oldRoute = this.parent.currentRoute;
            }

            this._state = TransitionState.InOldRoute;
            return this.oldRoute ? this.oldRoute.beforeExit(this.newRoute) : Promise.resolve({});
        }).then((transitionResult: IRouteCancelableTransitionResult) => {
            /* Before Enter */

            this.interceptTransition(transitionResult);
            return this.newRoute.beforeEnter();
        }).then((transitionResult: IRouteCancelableTransitionResult) => {
            /* On Exit */

            this.interceptTransition(transitionResult);
            return this.oldRoute ? this.oldRoute.onExit(this.newRoute) : Promise.resolve({});
        }).then((transitionResult: IRouteTransitionResult) => {
            /* On Enter */

            this.interceptTransition(transitionResult);
            this._state = TransitionState.InNewRoute;
            return this.newRoute.onEnter();
        }).then((transitionResult: IRouteTransitionResult) => {
            /* After Enter */

            this.interceptTransition(transitionResult);
            this._state = TransitionState.Ended;
            this._promiseResolve();
        }).catch((e: Error) => {
            if (e instanceof ReplacedError) {
                this._state = TransitionState.Replaced;
                this.newRoute.onCancelEnterTransition(e);
                this._promiseReject(e);
            } else if (e instanceof InterceptedError) {
                this._state = TransitionState.Intercepted;
                if (this.state === TransitionState.InOldRoute && this.oldRoute) {
                    this.oldRoute.onCancelExitTransition(e);
                }
                this.newRoute.onCancelEnterTransition(e);
                this._promiseReject(e);
            } else if (e instanceof CancellationError) {
                this._state = TransitionState.Cancelled;
                if (this.state === TransitionState.InOldRoute && this.oldRoute) {
                    this.oldRoute.onCancelExitTransition(e);
                }
                this.newRoute.onCancelEnterTransition(e);
                this._promiseReject(e);
            } else if (e instanceof RedirectedError) {
                this._state = TransitionState.Redirected;
                if (this.state === TransitionState.InOldRoute && this.oldRoute) {
                    this.oldRoute.onCancelExitTransition(e);
                }
                this.newRoute.onCancelEnterTransition(e);
                this._promiseReject(e);
            } else {
                this._promiseReject(e);
                throw e;
            }
        });
    }

    public cancel(reason: string): void {
        this._canceled = reason;
    }
}

export class Transitor implements ITransitor {
    private conflictStrategy: TransitionConflictStrategy;
    private transitionsQueue: Transition[] = [];
    private _currentRoute: IRoute;

    public get currentRoute() {
        return this._currentRoute;
    }

    public get inTransition() {
        return !!(this.transitionsQueue[0] && this.transitionsQueue[0].inProgress);
    }

    constructor(conflictStrategy: TransitionConflictStrategy) {
        this.conflictStrategy = conflictStrategy;
    }

    private shiftQueue() {
        if (!this.transitionsQueue[1]) {
            return;
        }
        this.transitionsQueue[0] = this.transitionsQueue[1];
        this.transitionsQueue[1] = undefined;
        this.transitionsQueue[0].start();
    }

    public transitionTo(route: IRoute): ITransition {
        let transition;

        if (!this.inTransition) {
            transition = new Transition(this, route, true);
            this.transitionsQueue[0] = transition;
        } else {
            switch (this.conflictStrategy) {
                case "cancelnew":
                    transition = new Transition(this, route, true);
                    transition.cancel("Already in transition");
                    break;
                case "cancelold":
                    this.transitionsQueue[0].cancel("Replaced by the new transition");
                    this.transitionsQueue[0] = transition = new Transition(this, route, true);
                    break;
                case "notransition":
                    transition = new Transition(null, route, true);
                    break;
                case "wait":
                    if (this.transitionsQueue[1]) {
                        this.transitionsQueue[1].start();
                        this.transitionsQueue[1].cancel("Replaced by the new transition");
                    } else {
                        this.transitionsQueue[0].promise.then(this.shiftQueue.bind(this), this.shiftQueue.bind(this));
                    }
                    this.transitionsQueue[1] = transition = new Transition(this, route, false);
                    break;
            }
        }

        if (this.conflictStrategy !== "notransition") {
            transition.promise.then(() => {
                this._currentRoute = transition.newRoute;
                this.transitionsQueue[0] = undefined;
            });
        }

        return transition;
    }
}
