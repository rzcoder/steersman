const NORMALIZE_PATH_REGEXP = /^[\s\/]*([^\s]*?)[\s\/]*$/i;

class InvalidPathError extends Error {
}

export function normalizePath(path: string): string {
    let match;
    if (typeof path !== "string" || !(match = path.match(NORMALIZE_PATH_REGEXP))) {
        throw new InvalidPathError("Invalid path string");
    }
    return match[1];
}