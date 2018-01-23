import {
    IHistory,
    IHistoryNavigateEvent
} from "../types";

export class VirtualHistory implements IHistory {
    private onNavigate: IHistoryNavigateEvent;
    private history: string[] = [];
    private currentPosition: number;

    public get currentPath(): string {
        if (this.currentPosition >= 0 && this.currentPosition < this.history.length) {
            return this.history[this.currentPosition];
        } else {
            return null;
        }
    }

    constructor(onNavigate: IHistoryNavigateEvent) {
        this.currentPosition = -1;
        this.onNavigate = onNavigate;
    }

    public setPath(path: string, replace: boolean): void {
        if (this.currentPosition >= 0 && this.currentPosition < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentPosition + 1);
        }

        if (replace) {
            this.history[this.currentPosition] = path;
        } else {
            this.history.push(path);
            this.currentPosition = this.history.length - 1;
        }
    }

    public goBack(): boolean {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            if (this.onNavigate) {
                this.onNavigate(this.currentPath);
                return true;
            }
            return false;
        }
    }

    public goForward(): boolean {
        if (this.currentPosition >= 0 && this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            if (this.onNavigate) {
                this.onNavigate(this.currentPath);
                return true;
            }
            return false;
        }
    }

    public start(): void {
    }

    public stop(): void {
    }
}