import Layer from "./layer";

export class Middlewares {
    public stack;

    constructor() {
        this.stack = []
    }

    public use(arg) {
        let path = '/';
        let callback;

        if (typeof arg === 'string') {
            path = arg;
            callback = arguments[1];
            this.stack.push(new Layer(path, callback));
            return;
        }

        callback = arg;
        this.stack.push(new Layer(path, callback));
    }
}