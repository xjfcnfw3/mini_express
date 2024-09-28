import Layer from "./layer";

describe("layer test", () => {

    it.each([
        ["/"], ["/hello"], ["hello/1"]
    ])("/ 경로로 설정된 layer는 반드시 true", (path) => {
        const layer = new Layer("/", () => {})
        const match = layer.match(path);
        expect(match.result).toBe(true);
    })

    it.each([
        ["/:id", "/1", {id: "1"}],
        ["/:id/:age", "/1/23", {id: "1", age: "23"}],
    ])("path parameter 추출", (path, request, answer) => {
        const layer = new Layer(path, () => {})
        const match = layer.match(request);
        expect(match.params).toEqual(answer);
    })
})