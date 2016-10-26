const NORMALIZE_PATH_REGEXP = /^[\s\/]*([^\s]*?)[\s\/]*$/i;

class InvalidPathError extends Error {
}

export function normalizePath(path: string): string {
    const match = path.match(NORMALIZE_PATH_REGEXP);
    if (typeof path !== "string" || !match) {
        throw new InvalidPathError("Invalid path string");
    }
    return match[1];
}