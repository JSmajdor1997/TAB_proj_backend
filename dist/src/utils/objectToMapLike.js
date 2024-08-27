"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objectToMapLike(obj, prefix) {
    let object = {
        set(key, value) {
            obj[prefix + (key !== null && key !== void 0 ? key : "").toString()] = value;
            return object;
        },
        get(key) {
            return obj[prefix + (key !== null && key !== void 0 ? key : "").toString()];
        },
        has(key) {
            return (prefix + (key !== null && key !== void 0 ? key : "").toString()) in obj;
        }
    };
    return object;
}
exports.default = objectToMapLike;
