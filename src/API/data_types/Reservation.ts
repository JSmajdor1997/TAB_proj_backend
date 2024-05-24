export enum ReservationStatus {
    Active,
    Canceled,
    Realized
}

export default interface Reservation {
    id: number
    book_id: number
    date: Date
    student_id: number
    status: ReservationStatus
}