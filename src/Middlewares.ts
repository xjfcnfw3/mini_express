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

    public handle(req, res) {
        let idx = 0; //현재 layer 인덱스
        const stack = this.stack;
        const path = req.path;
        next();

        function next() {
            let match;
            let layer
            while (match !== true && idx < stack.length) {
                layer  = stack[idx++];
                match = layer.match(path).result;
            }
            process(layer)
        }

        function process(layer) {
            layer.handle(req, res, next);
        }
    }
}