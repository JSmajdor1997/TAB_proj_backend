"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Period_1 = __importDefault(require("../../../utils/Period"));
function mockupFees() {
    return [
        {
            fee: 100,
            rangeMsMin: Period_1.default.Day * 30,
            rangeMsMax: Period_1.default.Day * 50,
        },
        {
            fee: 1000,
            rangeMsMin: Period_1.default.Day * 50,
            rangeMsMax: Period_1.default.Day * 90,
        },
        {
            fee: 10000,
            rangeMsMin: Period_1.default.Day * 90,
            rangeMsMax: Period_1.default.Day * 200,
        },
        {
            fee: 100000,
            rangeMsMin: Period_1.default.Day * 200,
            rangeMsMax: Period_1.default.Day * 1000000,
        }
    ];
}
exports.default = mockupFees;
