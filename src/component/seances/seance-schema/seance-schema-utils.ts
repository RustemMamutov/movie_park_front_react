import {getLogger} from "scripts/log-config";


class SeanceSchemaUtils {
    static prepareBlockUnblockPlacesRequestBody(selectedPlaceList: Set<number>,
                                                seanceId: number) {
        logger.trace('Start preparing block places request body.');

        const blockPlacesRequestBody = {
            "seanceId": seanceId,
            "placeIdList": [] as number[]
        };

        selectedPlaceList.forEach(placeId => {
            blockPlacesRequestBody.placeIdList.push(placeId);
        })

        logger.trace("Finish preparing block places request body:", blockPlacesRequestBody);
        return blockPlacesRequestBody;
    }

    static selectedPlaceListToString(selectedPlaceList: Set<number>) {
        return Array.from(selectedPlaceList).sort((a, b) => a - b).join(' ')
    }
}

const logger = getLogger(SeanceSchemaUtils.name);

export default SeanceSchemaUtils
