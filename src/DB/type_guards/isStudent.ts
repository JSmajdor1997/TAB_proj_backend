import { Librarian } from "../schema/LibrariansTable";
import { Student } from "../schema/StudentsTable";

export default function isStudent(user: Student | Librarian): user is Student {
    return (user as Student).classId != undefined
}