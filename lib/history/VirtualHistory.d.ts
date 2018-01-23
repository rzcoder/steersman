import { IHistory, IHistoryNavigateEvent } from "../types";
export declare class VirtualHistory implements IHistory {
    private onNavigate;
    private history;
    private currentPosition;
    readonly currentPath: string;
    constructor(onNavigate: IHistoryNavigateEvent);
    setPath(path: string, replace: boolean): void;
    goBack(): boolean;
    goForward(): boolean;
    start(): void;
    stop(): void;
}
