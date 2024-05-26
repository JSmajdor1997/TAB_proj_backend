import { faker } from '@faker-js/faker';
import { NewClass } from "../../schema/ClassesTable";

export default function mockupClasses(amount: number): NewClass[] {
    return Array.from({ length: amount }, (_, id) => ({
        name: `Class ${faker.number.int({ min: 1, max: 9 })}`,
        startingDate: faker.date.past({ refDate: new Date(), years: 9 }),
    }));
}