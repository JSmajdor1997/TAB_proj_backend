export default class JSONHelpers {
    static parse(key: string, value: any) {
        if (value != null && typeof value == "object") {
            if (value.__type === 'Map') {
                return new Map(Object.entries(value.value));
            } else if (value.__type === 'Date') {
                return new Date(value.value)
            }
        }

        return value;
    }

    static stringify(this: any, key: string, value: any) {
        if (value instanceof Map) {
            return {
                __type: 'Map',
                value: Object.fromEntries(value)
            };
        } else if (this[key] instanceof Date) {
            return {
                value: this[key].toUTCString(),
                __type: 'Date',
            }
        }

        return value;
    }
}