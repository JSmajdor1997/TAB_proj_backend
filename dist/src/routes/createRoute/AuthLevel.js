"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLevel = void 0;
var AuthLevel;
(function (AuthLevel) {
    AuthLevel[AuthLevel["Librarian"] = 0] = "Librarian";
    AuthLevel[AuthLevel["Student"] = 1] = "Student";
    AuthLevel[AuthLevel["AnyAuthorized"] = 2] = "AnyAuthorized";
    AuthLevel[AuthLevel["None"] = 3] = "None";
})(AuthLevel || (exports.AuthLevel = AuthLevel = {}));
