declare interface Unload {
    add(fn: () => void): () => void
    runAll(): void
    removeAll(): void
    debug(): void;

    _getCache(): any;
    _resetUnloaded(): void;
};

declare const unload: Unload;

export = unload;
