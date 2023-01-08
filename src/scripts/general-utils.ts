import moment from "moment";
import {getLogger} from "./log-config";

const DEFAULT_FORMAT = "YYYY-MM-DD"


class GeneralUtils {

    static dateToStringPromise(_date: Date, _format: string = DEFAULT_FORMAT): Promise<string> {
        return new Promise((resolve) => {
            resolve(GeneralUtils.dateToString(_date, _format))
        })
    }

    static todayDateStr(): string {
        return GeneralUtils.dateToString(new Date())
    }

    static dateToString(_date: Date, _format: string = DEFAULT_FORMAT): string {
        logger.trace(`convert date ${_date} to format ${_format}`)
        return moment(_date).format(_format);
    }

    static stringToDatePromise(_dateAsString: string,
                               _format?: string,
                               _delimiter?: string): Promise<Date> {
        return new Promise((resolve) => {
            resolve(GeneralUtils.stringToDate(_dateAsString, _format, _delimiter))
        })
    }

    static stringToDate(_dateAsString: string,
                        _format: string = "YYYY-MM-DD",
                        _delimiter: string = "-"): Date {
        logger.trace("stringToDate", _dateAsString)
        if (_format === undefined) {
            return new Date(_dateAsString);
        }

        const formatLowerCase: string = _format.toLowerCase();
        const formatItems: string[] = formatLowerCase.split(_delimiter);
        const dateItems: string[] = _dateAsString.split(_delimiter);
        const monthIndex: number = formatItems.indexOf("mm");
        const dayIndex: number = formatItems.indexOf("dd");
        const yearIndex: number = formatItems.indexOf("yyyy");
        const year: number = parseInt(dateItems[yearIndex]);
        const month: number = parseInt(dateItems[monthIndex]) - 1;
        const day: number = parseInt(dateItems[dayIndex]);
        return new Date(year, month, day);
    }
}

const logger = getLogger(GeneralUtils.name);

export default GeneralUtils
