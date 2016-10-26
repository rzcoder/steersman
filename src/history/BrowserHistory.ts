import {
    IHistory,
    IHistoryNavigateEvent
} from "../types";

export class BrowserHistory implements IHistory {
    private onNavigate: IHistoryNavigateEvent;
    currentPath: string;

    constructor(onNavigate: IHistoryNavigateEvent) {
        this.onNavigate = onNavigate;
        throw new Error("Not implemented");
    }

    setPath(path: string, replace: boolean): void {
    }

    goBack(): void {
    }

    goForward(): void {
    }
}