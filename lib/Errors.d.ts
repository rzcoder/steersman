import { IRouteTransitionRedirectOptions } from "./types";
export declare class TransitionError extends Error {
    constructor(message: string);
}
export declare class CancellationError extends Error {
    constructor(message: string);
}
export declare class InterceptedError extends Error {
    constructor(message: string);
}
export declare class ReplacedError extends Error {
    constructor(message: string);
}
export declare class RedirectedError extends Error {
    redirectOptions: IRouteTransitionRedirectOptions;
    constructor(message: string, redirectOptions: IRouteTransitionRedirectOptions);
}
