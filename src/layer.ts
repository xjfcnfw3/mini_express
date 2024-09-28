import {Keys, pathToRegexp} from "path-to-regexp";

export default class Layer {
    private handle: Function;
    private regex: RegExp;
    private paramNames: Keys;
    private readonly existRegex;

    constructor(path : string, callback : Function) {
        this.handle = callback;
        const { regexp, keys } = pathToRegexp(path);
        this.paramNames = keys;
        this.regex = regexp;
        this.existRegex = path !== "/";
    }

    public handleRequest(req, res, next) {
        this.handle(req, res, next);
    }

    public match(path): {result:boolean, params:{}} {
        if (path != null && !this.existRegex) return {result: true, params: {}};
        const match = this.regex.exec(path);
        if (!match) return {result: false, params: {}};

        const params :any = {};
        for (let i = 1; i < match.length; i++) {
            const paramName = this.paramNames[i - 1].name;
            params[paramName] = this.decodeParam(match[i]);
        }

        return {result: true, params};
    }

    private decodeParam(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
            throw e
        }
    }
}