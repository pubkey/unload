declare interface Unload {
    add(fn: () => void): () => void;
    runAll(): void;
    removeAll(): void;

    getSize(): number;
};

declare const unload: Unload;

export = unload;
