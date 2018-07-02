declare interface Unload {
    add(fn: () => void): () => void
    runAll(): void
    removeAll(): void
    debug(): void;
};

declare const unload: Unload;

export = unload;
