"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONHelpers {
    static parse(key, value) {
        if (value != null && typeof value == "object") {
            if (value.__type === 'Map') {
                return new Map(Object.entries(value.value));
            }
            else if (value.__type === 'Date') {
                return new Date(value.value);
            }
            else if (value.__type === "BigInt") {
                return BigInt(value.value);
            }
        }
        return value;
    }
    static stringify(key, value) {
        if (value instanceof Map) {
            return {
                __type: 'Map',
                value: Object.fromEntries(value)
            };
        }
        else if (this[key] instanceof Date) {
            return {
                value: this[key].toUTCString(),
                __type: 'Date',
            };
        }
        else if (typeof this[key] === "bigint") {
            return {
                value: this[key].toString(),
                __type: "BigInt"
            };
        }
        return value;
    }
}
exports.default = JSONHelpers;
