import {Middlewares} from "./Middlewares";
import Layer from "./layer";

describe('Middlewares 테스트', () => {
    let middlewares;
    const fn = () => {};

    beforeEach(() => {
        middlewares = new Middlewares();
    })

    it("함수 하나가 입력되면 '/' 경로를 가진 layer 삽입", () => {
        const push = jest.spyOn(middlewares.stack, 'push')
        middlewares.use(fn);

        expect(push).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith(new Layer('/', fn));
    })

    it("함수와 경로가 입력되면 입력된 경로와 함수의 layer 삽입", () => {
        const push = jest.spyOn(middlewares.stack, 'push')
        const path = '/hello'
        middlewares.use(path, fn);

        expect(push).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith(new Layer(path, fn));
    })
})