import { faker } from '@faker-js/faker';
import { NewLocation } from "../../schema/LocationsTable";

export default function mockupLocations(amount: number): NewLocation[] {
    return Array.from({ length: amount }, (_, index) => ({
        name: faker.word.words({ count: 1 })
    }))
}