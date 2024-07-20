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

    private async apiCall(path: string, params: any) {
        const response = await fetch(`${this.ServerPath}${path}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': this.cookie
            },
            body: JSON.stringify(params),
            credentials: 'include'
        });

        // Extract the set-cookie header if present and update the cookie field
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            this.cookie = setCookie;
        }

        return response.json();
    }

    // Account-related
    async login(userType: UserType, email: string, password: string) {
        return this.apiCall("/user/login", { email, password, userType });
    }

    async logout() {
        return this.apiCall("/user/logout", {});
    }

    async changePassword(oldPassword: string, newPassword: string) {
        return this.apiCall("/user/change-password", { oldPassword, newPassword });
    }

    async resetPassword(email: string) {
        return this.apiCall("/user/reset-password", { email });
    }

    readonly returnBookItem = async (bookItemId: number, fee: number) => {
        return this.apiCall("/books/return", { bookItemId, fee });
    }

    readonly reserveBook = async (studentId: number, bookId: number) => {
        return this.apiCall("/books/reserve", { studentId, bookId });
    }

    readonly cancelReservation = async (reservationId: number) => {
        return this.apiCall("/books/cancel-reservation", { reservationId });
    }

    readonly lendBook = async (librarianId: number, studentId: number, bookItemId: number) => {
        return this.apiCall("/books/lend", { librarianId, studentId, bookItemId });
    }

    readonly getMessages = async (studentId: number, range: [number, number]) => {
        return this.apiCall("/messages/get", { studentId, range });
    }

    readonly sendMessage = async (studentId: number, content: string) => {
        return this.apiCall("/messages/send", { studentId, content });
    }

    readonly createOne = async <T extends any>(type: T, obj: any) => {
        return this.apiCall(`/crud/${type}/create-one`, { item: obj });
    }

    readonly deleteOne = async <T extends any>(type: T, id: number) => {
        return this.apiCall(`/crud/${type}/delete-one`, { id });
    }

    readonly updateOne = async <T extends any>(type: T, id: number, obj: any) => {
        return this.apiCall(`/crud/${type}/update-one`, { id, item: obj });
    }

    readonly getOne = async <T extends any>(type: T, id: number) => {
        return this.apiCall(`/crud/${type}/get-one`, { id });
    }

    readonly getMany = async <T extends any>(type: T, query: any, range: [number, number]) => {
        return this.apiCall(`/crud/${type}/get-many`, { query, range });
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

    readonly getCurrentUser = async (): Promise<{ id: number, userType: UserType }> => {
        return this.apiCall(`/user/current-user`, {});
    }
}
