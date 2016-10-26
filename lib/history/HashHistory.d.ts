import { IHistory, IHistoryNavigateEvent } from "../types";
export declare class HashHistory implements IHistory {
    private onNavigate;
    currentPath: string;
    constructor(onNavigate: IHistoryNavigateEvent);
    setPath(path: string, replace: boolean): void;
    goBack(): void;
    goForward(): void;
}
