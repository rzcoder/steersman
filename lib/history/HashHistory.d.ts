import { IHistory, IHistoryNavigateEvent } from "../types";
export declare class HashHistory implements IHistory {
    private started;
    private onNavigate;
    readonly currentPath: string;
    constructor(onNavigate: IHistoryNavigateEvent);
    private navigate(e, path?);
    setPath(path: string, replace: boolean): void;
    goBack(): boolean;
    goForward(): boolean;
    start(): void;
    stop(): void;
}
