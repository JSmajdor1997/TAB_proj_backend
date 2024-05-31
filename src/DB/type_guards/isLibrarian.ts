import { Librarian } from "../schema/LibrariansTable";
import { Student } from "../schema/StudentsTable";
import isStudent from "./isStudent";

export default function isLibrarian(user: Student | Librarian): user is Librarian {
    return !isStudent(user)
}