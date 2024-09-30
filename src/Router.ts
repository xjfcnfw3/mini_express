export default class Router {
    public stack;
    constructor() {
        this.stack = [];
    }

    /**
     * 모든 스택을 탐색하여 경로와 메소드가 모두 맞으면 return 진행 후 리턴하면 끝
     * @param req
     * @param res
     * @param next
     */
    dispatch(req, res, next) {
        if (req.path == "/hi") {
            console.log("end");
            return;
        }
        next()
    }
}