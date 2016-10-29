import { IHistory, IHistoryNavigateEvent } from "../types";
export declare class BrowserHistory implements IHistory {
    private started;
    private onNavigate;
    readonly currentPath: string;
    constructor(onNavigate: IHistoryNavigateEvent);
    private navigate(e, path?);
    setPath(path: string, replace: boolean): void;
    goBack(): void;
    goForward(): void;
    start(): void;
    stop(): void;
}
