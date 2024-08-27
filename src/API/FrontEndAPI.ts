import JSONHelpers from "../utils/JSONHelpers";
import API from "./API";
import { CreateOneType, CreateQuery } from "./params/CreateOne";
import { DeleteOneType } from "./params/DeleteOne";
import { GetManyQuery, GetManyType } from "./params/GetMany";
import { GetOneType } from "./params/GetOne";
import { UpdateOneType, UpdateQuery } from "./params/UpdateOne";

export enum UserType {
    Librarian = 0,
    Student = 1,
}

export default class FrontEndAPI {
    private readonly ServerPath: string;
    private cookie: string = '';

    constructor(path: string) {
        this.ServerPath = path;
    }

    private async apiCall(path: string, params: any): Promise<{data: any, error: any}> {
        const response = await fetch(`${this.ServerPath}${path}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': this.cookie
            },
            body: JSON.stringify(params, JSONHelpers.stringify),
            credentials: 'include'
        });

        return response.text().then(it => {
            return JSON.parse(it, JSONHelpers.parse)
        });
    }

    // Account-related
    async login(userType: UserType, email: string, password: string): Promise<{}> {
        return this.apiCall("/user/login", { email, password, userType });
    }

    async logout(): Promise<{}> {
        return this.apiCall("/user/logout", {});
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<{}> {
        return this.apiCall("/user/change-password", { oldPassword, newPassword });
    }

    async resetPassword(email: string): Promise<{}> {
        return this.apiCall("/user/reset-password", { email });
    }

    readonly returnBookItem = async (bookItemId: number, fee: number) => {
        return this.apiCall("/books/return", { bookItemId, fee });
    }

    readonly reserveBook = async (studentId: number, bookId: number): ReturnType<API["reserveBook"]> => {
        return this.apiCall("/books/reserve", { studentId, bookId });
    }

    readonly cancelReservation = async (reservationId: number): ReturnType<API["cancelReservation"]> => {
        return this.apiCall("/books/cancel-reservation", { reservationId });
    }

    readonly lendBook = async (librarianId: number, studentId: number, bookItemId: number): ReturnType<API["lendBook"]> => {
        return this.apiCall("/books/lend", { librarianId, studentId, bookItemId });
    }

    readonly createOne = async <T extends CreateOneType>(type: T, obj: CreateQuery<T>) => {
        return this.apiCall(`/crud/${type}/create-one`, { item: obj });
    }

    readonly deleteOne = async <T extends DeleteOneType>(type: T, id: number): ReturnType<API["deleteOne"]> => {
        return this.apiCall(`/crud/${type}/delete-one`, { id });
    }

    readonly updateOne = async <T extends UpdateOneType>(type: T, id: number, obj: UpdateQuery<T>): ReturnType<API["updateOne"]> => {
        return this.apiCall(`/crud/${type}/update-one`, { id, item: obj });
    }

    readonly getOne = async <T extends GetOneType>(type: T, id: number): ReturnType<API["getOne"]> => {
        return this.apiCall(`/crud/${type}/get-one`, { id });
    }

    readonly getMany = async <T extends GetManyType>(type: T, query: GetManyQuery<T>, range: [number, number]): ReturnType<API["getMany"]> => {
        return this.apiCall(`/crud/${type}/get-many`, { query, range });
    }

    readonly getCurrentUser = async (): Promise<{ id: number, userType: UserType }> => {
        return (await this.apiCall(`/user/current-user`, {})).data;
    }

    readonly downloadReport = async (reportId: number) => {
        return this.apiCall(`/reports/download`, { reportId });
    }

    readonly getAllGeneratedReports = async (reportId: number) => {
        return this.apiCall(`/reports/get-all-generated`, { reportId });
    }

    readonly requestReportGeneration = async (reportId: number) => {
        return this.apiCall(`/reports/request-creation`, { reportId });
    }
}
