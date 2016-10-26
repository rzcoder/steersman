import { IRoute, ITransitor, TransitionConflictStrategy, ITransition } from "./types";
export declare class Transitor implements ITransitor {
    private conflictStrategy;
    private transitionsQueue;
    private _currentRoute;
    readonly currentRoute: IRoute;
    readonly inTransition: boolean;
    constructor(conflictStrategy: TransitionConflictStrategy);
    private shiftQueue();
    transitionTo(route: IRoute): ITransition;
}
