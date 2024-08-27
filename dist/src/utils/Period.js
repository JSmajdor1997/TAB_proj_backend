"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Period;
(function (Period) {
    Period[Period["Ms"] = 1] = "Ms";
    Period[Period["Second"] = 1000] = "Second";
    Period[Period["Minute"] = 60000] = "Minute";
    Period[Period["Hour"] = 3600000] = "Hour";
    Period[Period["Day"] = 86400000] = "Day";
    Period[Period["Weekd"] = 604800000] = "Weekd";
})(Period || (Period = {}));
exports.default = Period;
