export default interface Borrowing {
    id: number
    student_id: number
    book_item_id: number
    librarian_id: number
    borrowing_date: Date
    return_date: Date
    paid_fee: number | null
}