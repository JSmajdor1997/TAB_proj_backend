import { faker } from '@faker-js/faker';
import { NewLanguage } from '../../schema/LanguagesTable';

export default function mockupLanguages(): NewLanguage[] {
    return [
        {
            code: "pl",
            name: "polski"
        },
        {
            code: "en",
            name: "angielski"
        },
        {
            code: "de",
            name: "niemiecki"
        }
    ]
}