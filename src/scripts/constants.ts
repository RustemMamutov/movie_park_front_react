import {LogLevel} from "typescript-logging";

export const LOGGING_LEVEL = LogLevel.Debug

export const OPERATOR_CREDS = {
    username: "operator@gmail.com",
    password: "password"
}

export const SELECTED_SEAT_RADIUS = "3.0%"
export const UNSELECTED_SEAT_RADIUS = "2.5%"

export const monthDict: Record<number, string[]> = {
    0: ["Январь", "янв"],
    1: ["Февраль", "фев"],
    2: ["Март", "март"],
    3: ["Апрель", "апр"],
    4: ["Май", "май"],
    5: ["Июнь", "июнь"],
    6: ["Июль", "июль"],
    7: ["Август", "авг"],
    8: ["Сентябрь", "сент"],
    9: ["Октябрь", "окт"],
    10: ["Ноябрь", "ноя"],
    11: ["Декабрь", "дек"],
};

export const daysDict: Record<number, string> = {
    0: "вс",
    1: "пн",
    2: "вт",
    3: "ср",
    4: "чт",
    5: "пт",
    6: "сб"
};


