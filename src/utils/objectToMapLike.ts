import { MapLike } from "memo-decorator"

export default function objectToMapLike<K extends {}, V>(obj: {}, prefix: string): MapLike<K, V> {
    let object: MapLike<K, V> = {
        set(key, value) {
            (obj as any)[prefix + (key ?? "").toString()] = value
            return object
        },
        get(key) {
            return (obj as any)[prefix + (key ?? "").toString()]
        },
        has(key) {
            return (prefix + (key ?? "").toString()) in obj
        }
    }

    return object
}