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

        let formatLowerCase: string = _format.toLowerCase();
        let formatItems: string[] = formatLowerCase.split(_delimiter);
        let dateItems: string[] = _dateAsString.split(_delimiter);
        let monthIndex: number = formatItems.indexOf("mm");
        let dayIndex: number = formatItems.indexOf("dd");
        let yearIndex: number = formatItems.indexOf("yyyy");
        let year: number = parseInt(dateItems[yearIndex]);
        let month: number = parseInt(dateItems[monthIndex]);
        let day: number = parseInt(dateItems[dayIndex]);
        month -= 1;
        return new Date(year, month, day);
    }
}

const logger = getLogger(GeneralUtils.name);

export default GeneralUtils
