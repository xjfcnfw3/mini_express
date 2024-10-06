import {Keys, pathToRegexp} from "path-to-regexp";

export default class Layer {
    private readonly handle: Function;
    private regex: RegExp;
    private paramNames: Keys;
    private readonly existRegex;
    private _params;
    private _path;

    constructor(path : string, callback : Function) {
        this.handle = callback;
        const { regexp, keys } = pathToRegexp(path, {end: false});
        this.paramNames = keys;
        this.regex = regexp;
        this.existRegex = path !== "/";
    }

    public handleRequest(req, res, next) {
        if (this.handle.length > 3) {
            next()
        }

        try {
            this.handle(req, res, next);
        } catch (e) {
            next(e)
        }
    }

    public handleError(error, req, res, next) {
        if (this.handle.length !== 4) {
            next()
        }

        try {
            this.handle(error, req, res, next);
        } catch (e) {
            next(e)
        }
    }

    public match(path) {
        if (path != null && !this.existRegex) {
            this._params = {}
            this._path = ""
            return true
        }
        const match = this.regex.exec(path);
        if (!match) {
            this._params = {}
            this._path = ""
            return false
        }

        const params :any = {};

        for (let i = 1; i < match.length; i++) {
            const paramName = this.paramNames[i - 1].name;
            params[paramName] = this.decodeParam(match[i]);
        }
        this._params = params;
        this._path = match[0];

        return true;
    }

    get params() {
        return this._params;
    }

    get path() {
        return this._path;
    }

    private decodeParam(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
            throw e
        }
    }
}