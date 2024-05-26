import Period from "../../../utils/Period";
import { NewFee } from "../../schema/FeesTable";

export default function mockupFees(): NewFee[] {
    return [
        {
            fee: 100,
            rangeMsMin: Period.Day * 30,
            rangeMsMax: Period.Day * 50,
        },
        {
            fee: 1000,
            rangeMsMin: Period.Day * 50,
            rangeMsMax: Period.Day * 90,
        },
        {
            fee: 10000,
            rangeMsMin: Period.Day * 90,
            rangeMsMax: Period.Day * 200,
        },
        {
            fee: 100000,
            rangeMsMin: Period.Day * 200,
            rangeMsMax: Period.Day * 1000000,
        }
    ]
}