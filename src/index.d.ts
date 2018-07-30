declare type addReturn = {
    remove: () => void;
    run: () => any;
};

declare interface Unload {
    add(fn: () => void): addReturn;
    runAll(): Promise<any>;
    removeAll(): void;
    getSize(): number;
};

declare const unload: Unload;

export = unload;
