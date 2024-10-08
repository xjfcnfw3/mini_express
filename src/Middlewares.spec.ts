import {Middlewares} from "./Middlewares";
import Layer from "./layer";
import Router from "./Router";

describe('Middlewares 테스트', () => {
    let middlewares;
    const fn = () => {};
    let req;
    const res = {};
    const functions = {
        fn1: (req, res, next) => {
            req.value += 1;
            next();
        },
        fn2: (req, res, next) => {
            req.value += 4;
        }
    }

    beforeEach(() => {
        middlewares = new Middlewares();
        req = {value: 1, path: "/hello"};
    })

    it("함수 하나가 입력되면 '/' 경로를 가진 layer 삽입", () => {
        const push = jest.spyOn(middlewares.stack, 'push');
        middlewares.use(fn);

        expect(push).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith(new Layer('/', fn));
    })

    it("함수와 경로가 입력되면 입력된 경로와 함수의 layer 삽입", () => {
        const push = jest.spyOn(middlewares.stack, 'push');
        const path = '/hello';
        middlewares.use(path, fn);

        expect(push).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith(new Layer(path, fn));
    })

    it("등록된 layer의 handle을 기반으로 작업 진행", () => {
        const spyFn1 = jest.spyOn(functions, 'fn1');
        const spyFn2 = jest.spyOn(functions, 'fn2');

        middlewares.use(functions.fn1);
        middlewares.use(functions.fn2);
        middlewares.handle(req, res);


        expect(spyFn1).toHaveBeenCalled();
        expect(spyFn2).toHaveBeenCalled();
        expect(req.value).toEqual(6);
    })

    it.each([
        ['/hi', '/', 5],
        ['/hello', '/', 6],
        ['/hi', '/hello', 5]
    ])("경로가 매칭되는 layer의 작업 진행", (path1, path2, answer) => {

        middlewares.use(path1, functions.fn1);
        middlewares.use(path2, functions.fn2);
        middlewares.handle(req, res);

        expect(req.value).toEqual(answer);
    })

    it("등록된 router의 handle을 기반으로 작업 진행", () => {
        const router = new Router();

        middlewares.use(functions.fn1);
        middlewares.use(router.dispatch);
        middlewares.use(functions.fn2);
        middlewares.handle(req, res);

        expect(req.value).toEqual(6);
    })

    it("error를 next로 전달", () => {
        const error = new Error("next");
        const functions = {
            fn1: (req, res, next) => {
                next(error);
            },
            fn2: (req, res, next) => {
                req.value += 4;
            },
            fn3: (req, res, next) => {

            }
        }
        const spyFn3 = jest.spyOn(functions, 'fn3');
        middlewares.use(functions.fn1);
        middlewares.use(functions.fn2);
        middlewares.use(functions.fn3);

        middlewares.handle(req, res);

        expect(spyFn3).toHaveBeenCalled();
    })

    it("경로가 존재하는 layer를 지나가면 req의 baseUrl이 수정된다.", () => {
        let result = "";
        const req = {
            path: "/hello/world"
        }
        const fn1 = (req, res, next) => {
            result = req.path;
            next();
        }

        middlewares.use("/hello", fn1);

        middlewares.handle(req, res);

        expect(result).toBe("/world");
        expect(req.path).toBe("/hello/world");
    })
})