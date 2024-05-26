import { faker } from '@faker-js/faker';
import { NewMessage } from '../../schema/MessagesTable';
import { Student } from '../../schema/StudentsTable';

export default function mockupMessages(students: Student[]): NewMessage[] {
    return faker.helpers.arrayElements(students, { min: 5, max: Math.ceil(students.length / 2) }).map(student => ({
        date: faker.date.recent({ refDate: new Date() }),
        content: faker.word.words(),
        studentId: student.id,
        isFromLibrarian: faker.datatype.boolean()
    }))
}