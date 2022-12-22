import {MovieInfo, SeanceInfo, SeancePlace} from "./data-structures";
import {OPERATOR_CREDS} from "./constants";
import httpClient from "./http-client";
import {getLogger} from "./log-config";

const getSeanceInfoUrl: string = '/seances/info';
const getSeancePlacesInfoUrl: string = '/seances/places/info';
const blockPlaceUrl: string = '/seances/places/block';
const unblockPlaceUrl: string = '/seances/places/unblock';
const getSeancesByMovieAndDateUrl: string = '/seances/all-by-movie-and-date';
const getAllMoviesByIdSetUrl: string = '/movies/all-by-id-set';
const getAllMoviesByPeriodUrl: string = '/movies/all-by-period';

const logger = getLogger("ApiMethods");

function getSeanceInfoById(seanceId: number): Promise<SeanceInfo> {
    logger.debug('Start getting seance info by id:', seanceId);
    let myUrl = `${getSeanceInfoUrl}/${seanceId}`;

    return httpClient.get(myUrl)
        .then(response => {
            logger.trace('Finish getting seance info by id:', seanceId, response)
            return response.data as unknown as SeanceInfo;
        })
        .catch(error => error)
}

function getSeancePlacesInfoById(seanceId: number): Promise<SeancePlace[]> {
    logger.debug('Start getting seance places info by id:', seanceId);
    let myUrl = `${getSeancePlacesInfoUrl}/${seanceId}`;
    logger.trace('myUrl:', myUrl);

    return httpClient.get(myUrl)
        .then(response => {
            logger.trace(`Finish getting seance places info by id = ${seanceId}:`, response)
            let result: SeancePlace[] = []
            response.data.forEach((key: SeancePlace) => {
                result.push(key)
            })
            return result;
        })
        .catch(error => error)
}

function blockPlaces(requestBody: Object) {
    logger.debug('Start blocking places.');
    return blockUnblockPlaces(blockPlaceUrl, requestBody)
}

function unblockPlaces(requestBody: Object) {
    logger.debug('Start unblocking places.');
    return blockUnblockPlaces(unblockPlaceUrl, requestBody)
}

function blockUnblockPlaces(url: string, requestBody: Object) {
    return httpClient.put(url, requestBody, {
        auth: OPERATOR_CREDS
    })
        .then(response => {
            logger.debug("All seances in all movie parks:", response);
            return response;
        })
        .then(blockedPlace => {
            logger.debug('Finish blocking/unblocking places. ', blockedPlace)
        })
        .catch(error => error)
}

function getAllSeancesByMovieAndDate(movieId: number, dateAsString: string):
    Promise<Map<string, SeanceInfo[]>> {
    logger.debug('Start getting all seances by movie and date.');
    let myUrl = `${getSeancesByMovieAndDateUrl}?movieId=${movieId}&date=${dateAsString}`;

    return httpClient.get(myUrl)
        .then(response => {
            logger.debug("All seances by movie and date:", response.data);
            let result: Map<string, SeanceInfo[]> = new Map<string, SeanceInfo[]>();
            Object.keys(response.data).forEach((cinemaPark: string) => {
                let seanceList: SeanceInfo[] = []
                response.data[cinemaPark].forEach((seanceInfo: SeanceInfo) => {
                    seanceList.push(seanceInfo)
                })
                result.set(cinemaPark, seanceList);
            })
            return result;
        })
        .catch(error => error)
}

function getAllMoviesByIdSet(idSet: Set<number>): Promise<Map<number, MovieInfo>> {
    logger.debug("getAllMoviesByIdSet", idSet);
    const myUrl = `${getAllMoviesByIdSetUrl}`;

    let idList: number[] = []
    idSet.forEach(id => idList.push(id))
    const requestBody = {"movieIdSet": idList}
    logger.trace("requestBody", requestBody)

    return httpClient.post(myUrl, requestBody)
        .then(response => {
            logger.trace("All movies by id set response.data:", response.data);
            let result: Map<number, MovieInfo> = new Map<number, MovieInfo>();
            Object.keys(response.data).forEach((movieId: string) => {
                let movieName: string = response.data[movieId].movieName
                let imgList: string[] = response.data[movieId]["base64Images"].split("|")
                result.set(parseInt(movieId), new MovieInfo(parseInt(movieId), movieName, imgList))
            })
            logger.trace("All movies by id set result:", result);
            return result;
        })
        .catch(error => error)
}

function getMovieListByPeriod(startPeriodDateStr: string, endPeriodDateStr: string):
    Promise<Map<string, Map<number, string>>> {
    logger.debug(`getMovieListByPeriod by period ${startPeriodDateStr}-${endPeriodDateStr}`);
    let myUrl = `${getAllMoviesByPeriodUrl}?periodStart=${startPeriodDateStr}&periodEnd=${endPeriodDateStr}`;

    return httpClient.get(myUrl)
        .then(response => {
            logger.trace("Finish getting today movies list:", response.data);
            let result: Map<string, Map<number, string>> =
                new Map<string, Map<number, string>>();
            Object.keys(response.data).forEach((date: string) => {
                result.set(date, response.data[date] as Map<number, string>);
            })
            return result;
        })
        .catch(error => error)
}


export {
    SeanceInfo,
    SeancePlace,
    MovieInfo,
    getSeanceInfoById,
    getSeancePlacesInfoById,
    blockPlaces,
    unblockPlaces,
    getAllSeancesByMovieAndDate,
    getAllMoviesByIdSet,
    getMovieListByPeriod
}
