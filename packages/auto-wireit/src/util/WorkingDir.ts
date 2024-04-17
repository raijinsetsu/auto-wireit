export class WorkingDir {
    #val = process.cwd();

    static singleton = new WorkingDir();

    private constructor() {}

    set(val: string) {
        this.#val = val;
    }

    get() {
        return this.#val;
    }
}
