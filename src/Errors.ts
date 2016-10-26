import {IRouteTransitionRedirectOptions} from "./types";

export class TransitionError extends Error {
    constructor (message: string) {
        super();
        this.message = message;
    }
}

export class CancellationError extends Error {
    constructor (message: string) {
        super();
        this.message = message;
    }
}

export class InterceptedError extends Error {
    constructor (message: string) {
        super();
        this.message = message;
    }
}

export class ReplacedError extends Error {
    constructor (message: string) {
        super();
        this.message = message;
    }
}

export class RedirectedError extends Error {
    public redirectOptions: IRouteTransitionRedirectOptions;

    constructor (message: string, redirectOptions: IRouteTransitionRedirectOptions) {
        super();
        this.message = message;
        this.redirectOptions = redirectOptions;
    }
}