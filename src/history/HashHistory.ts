import {
    IHistory,
    IHistoryNavigateEvent
} from "../types";

export class HashHistory implements IHistory {
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
            let href = location.href.replace(/#.*$/, "");
            location.replace(href + "#" + path);
        } else {
            window.location.hash = "#" + path;
        }
        if (this.started) {
            this.navigate(null, path);
        }
    }

    public goBack(): void {
        history.back();
    }

    public goForward(): void {
        history.forward();
    }

    public start(): void {
        this.started = true;
        addEventListener("hashchange", this.navigate, false);
    }

    public stop(): void {
        this.started = false;
        removeEventListener("hashchange", this.navigate, false);
    }
}