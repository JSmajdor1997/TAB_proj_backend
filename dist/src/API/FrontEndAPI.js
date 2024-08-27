"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const JSONHelpers_1 = __importDefault(require("../utils/JSONHelpers"));
var UserType;
(function (UserType) {
    UserType[UserType["Librarian"] = 0] = "Librarian";
    UserType[UserType["Student"] = 1] = "Student";
})(UserType || (exports.UserType = UserType = {}));
class FrontEndAPI {
    constructor(path) {
        this.cookie = '';
        this.returnBookItem = (bookItemId, fee) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/books/return", { bookItemId, fee });
        });
        this.reserveBook = (studentId, bookId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/books/reserve", { studentId, bookId });
        });
        this.cancelReservation = (reservationId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/books/cancel-reservation", { reservationId });
        });
        this.lendBook = (librarianId, studentId, bookItemId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/books/lend", { librarianId, studentId, bookItemId });
        });
        this.createOne = (type, obj) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/crud/${type}/create-one`, { item: obj });
        });
        this.deleteOne = (type, id) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/crud/${type}/delete-one`, { id });
        });
        this.updateOne = (type, id, obj) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/crud/${type}/update-one`, { id, item: obj });
        });
        this.getOne = (type, id) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/crud/${type}/get-one`, { id });
        });
        this.getMany = (type, query, range) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/crud/${type}/get-many`, { query, range });
        });
        this.getCurrentUser = () => __awaiter(this, void 0, void 0, function* () {
            return (yield this.apiCall(`/user/current-user`, {})).data;
        });
        this.downloadReport = (reportId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/reports/download`, { reportId });
        });
        this.getAllGeneratedReports = (reportId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/reports/get-all-generated`, { reportId });
        });
        this.requestReportGeneration = (reportId) => __awaiter(this, void 0, void 0, function* () {
            return this.apiCall(`/reports/request-creation`, { reportId });
        });
        this.ServerPath = path;
    }
    apiCall(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.ServerPath}${path}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cookie': this.cookie
                },
                body: JSON.stringify(params, JSONHelpers_1.default.stringify),
                credentials: 'include'
            });
            return response.text().then(it => {
                return JSON.parse(it, JSONHelpers_1.default.parse);
            });
        });
    }
    // Account-related
    login(userType, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/user/login", { email, password, userType });
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/user/logout", {});
        });
    }
    changePassword(oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/user/change-password", { oldPassword, newPassword });
        });
    }
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiCall("/user/reset-password", { email });
        });
    }
}
exports.default = FrontEndAPI;
