import {
    IHistory,
    IHistoryNavigateEvent
} from "../types";

export class BrowserHistory implements IHistory {
    private started: boolean;
    private onNavigate: IHistoryNavigateEvent;

    public get currentPath(): string {
        return location.pathname;
    }

    constructor(onNavigate: IHistoryNavigateEvent) {
        this.onNavigate = onNavigate;
    }

    private navigate(e: Event, path?: string) {
        this.onNavigate(path || this.currentPath);
    }

    public setPath(path: string, replace: boolean): void {
        if (replace) {
            history.pushState(null, null, path);
        } else {
            history.replaceState(null, null, path);
        }
    }

    public goBack(): boolean {
        history.back();
        return true;
    }

    public goForward(): boolean {
        history.forward();
        return true;
    }

    public start(): void {
        this.started = true;
        addEventListener("popstate", this.navigate, false);
    }

    public stop(): void {
        this.started = false;
        removeEventListener("popstate", this.navigate, false);
    }
}