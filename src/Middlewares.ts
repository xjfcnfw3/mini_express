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
        let removedPath = "";
        next();

        function next(error?) {
            if (removedPath.length > 0) {
                req.path = removedPath + req.path;
            }
            let match;
            let layer
            const path = req.path;
            while (match !== true && idx < stack.length) {
                layer  = stack[idx++];
                match = layer.match(path);
            }
            if (!match) return
            process(layer, error)
        }

        function process(layer, error) {
            if (error) {
                layer.handleError(req, res, next, error);
                return
            }
            trimPath(layer);
        }

        function trimPath(layer) {
            if (layer.path) {
                removedPath = layer.path;
                req.path = req.path.slice(removedPath.length);
            }
            layer.handleRequest(req, res, next);
        }
    }
}