"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isStudent_1 = __importDefault(require("./isStudent"));
function isLibrarian(user) {
    return !(0, isStudent_1.default)(user);
}
exports.default = isLibrarian;
