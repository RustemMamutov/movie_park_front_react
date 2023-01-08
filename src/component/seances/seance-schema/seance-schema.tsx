import React, {Component} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import SeanceSchemaUtils from "./seance-schema-utils";
import {getSeanceInfoById, getSeancePlacesInfoById} from "scripts/api-methods";
import {hallsPlacesInfo, SeanceInfo, SeancePlace} from "scripts/data-structures";

import {NavigateFunction} from "react-router/dist/lib/hooks";
import {getLogger} from "scripts/log-config";
import Seat from "component/seances/seat/seat";

interface ISeanceSchemaProps {
    navigation: NavigateFunction;
    seanceId: number;
}

interface ISeanceSchemaState {
    seanceId: number;
    seanceInfo: SeanceInfo;
    totalPrice: number;
    selectedPlaceList: Set<number>;
    seancePlacesInfoList: SeancePlace[];
}

class SeanceSchemaClass extends Component<ISeanceSchemaProps, ISeanceSchemaState> {
    constructor(props: ISeanceSchemaProps) {
        super(props);

        this.state = {
            seanceId: props.seanceId,
            seanceInfo: {} as SeanceInfo,
            totalPrice: 0,
            selectedPlaceList: new Set<number>(),
            seancePlacesInfoList: []
        }
    }

    async componentDidMount() {
        const seanceInfoById = await getSeanceInfoById(this.state.seanceId)
        const seancePlacesInfoList = await getSeancePlacesInfoById(this.state.seanceId)
        this.setState({seancePlacesInfoList: seancePlacesInfoList,
            seanceInfo: seanceInfoById})
    }

    updateSelectPlaceList = (placeId: number, seatPrice: number, add: boolean) => {
        let deltaPrice = seatPrice;
        if (add) {
            this.state.selectedPlaceList.add(placeId)
            logger.info(`place ${placeId} added to selectedPlaceList ${JSON.stringify(this.state.selectedPlaceList)}`)
        } else {
            this.state.selectedPlaceList.delete(placeId)
            deltaPrice = - seatPrice;
            logger.info(`place ${placeId} removed from selectedPlaceList ${JSON.stringify(this.state.selectedPlaceList)}`)
        }
        this.setState(() => { return {totalPrice: this.state.totalPrice + deltaPrice}});
    }

    drawAllSeats() {
        const basePrice = this.state.seanceInfo.basePrice;
        const vipPrice = this.state.seanceInfo.vipPrice;
        const hallPlacesInfo = hallsPlacesInfo[this.state.seanceInfo.hallId]
        const result: any[] = []
        this.state.seancePlacesInfoList.forEach((eachPlace: SeancePlace) => {
            const placeInfo = hallPlacesInfo[eachPlace.placeId]
            result.push(<Seat placeId={eachPlace.placeId}
                              xoffset={250 + 5 * placeInfo.coordX}
                              yoffset={120 + 5 * placeInfo.coordY}
                              price={placeInfo.isVip ? vipPrice : basePrice}
                              scale="8%"
                              blocked={eachPlace.blocked}
                              vip={placeInfo.isVip}
                              selectedHook={this.updateSelectPlaceList}/>)
        })
        return result
    }

    buyTickets = () => {
        const blockPlacesRequestBody = SeanceSchemaUtils.prepareBlockUnblockPlacesRequestBody(
            this.state.selectedPlaceList, this.state.seanceId)
        this.props.navigation('/seance/payment', {
            state: {blockPlacesRequestBody: blockPlacesRequestBody}
        });
    }

    render() {
        return (
            <div style={{border: "solid black"}}>
                <div>Seance id: {this.state.seanceId} TOTAL PRICE: {this.state.totalPrice}</div>
                <div>SELECTED: {SeanceSchemaUtils.selectedPlaceListToString(this.state.selectedPlaceList)}</div>
                <button type="button" className="btn btn-primary" onClick={this.buyTickets}>Buy tickets</button>
                <br/>
                {this.drawAllSeats()}
            </div>
        );
    }
}

const logger = getLogger(SeanceSchema.name);

export default function SeanceSchema() {
    return <SeanceSchemaClass seanceId={parseInt(String(useParams().seanceId))}
                              navigation={useNavigate()}/>
}