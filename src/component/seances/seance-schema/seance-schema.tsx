import React, {Component} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import css from './seance-schema.module.css';
import SeanceSchemaUtils from "./seance-schema-utils";
import {SELECTED_SEAT_RADIUS, UNSELECTED_SEAT_RADIUS} from "scripts/constants";
import {getSeanceInfoById, getSeancePlacesInfoById} from "scripts/api-methods";
import {hallsPlacesInfo, SeanceInfo, SeancePlace} from "scripts/data-structures";

import {NavigateFunction} from "react-router/dist/lib/hooks";
import {getLogger} from "scripts/log-config";

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
        let seanceInfoById = await getSeanceInfoById(this.state.seanceId)
        let seancePlacesInfoList = await getSeancePlacesInfoById(this.state.seanceId)
        this.setState(
            {seancePlacesInfoList: seancePlacesInfoList, seanceInfo: seanceInfoById},
            this.drawAllSeats
        )
    }

    drawAllSeats() {
        let basePrice = this.state.seanceInfo.basePrice;
        let vipPrice = this.state.seanceInfo.vipPrice;
        let hallPlacesInfo = hallsPlacesInfo[this.state.seanceInfo.hallId]
        let svgns = "http://www.w3.org/2000/svg";
        let container: any = document.getElementById('seanceGraphArea');

        this.state.seancePlacesInfoList.forEach((eachPlace: SeancePlace) => {
            let placeId: number = eachPlace.placeId;
            let blocked: boolean = eachPlace.blocked;
            //remove old element
            let currentElement = container.getElementById(placeId);
            if (currentElement != null) {
                currentElement.remove();
            }

            //create new element
            let circle = document.createElementNS(svgns, 'circle');
            let placeInfo = hallPlacesInfo[placeId]
            SeanceSchemaUtils.createCircleByParameters(circle, placeId, blocked,
                placeInfo, basePrice, vipPrice);
            container.appendChild(circle);
        })

        let width = container.getBoundingClientRect().width;
        let height = container.getBoundingClientRect().height;
        let curvedLine = document.createElementNS(svgns, 'path');
        SeanceSchemaUtils.createScreen(curvedLine, width, height);
        container.appendChild(curvedLine);
    }

    selectThePlace = (event: any): void => {
        function _changeCircle(_element: Element, _radius: string, _selected: boolean) {
            _element.setAttribute('r', _radius);
            _element.setAttribute('selected', _selected + "");
        }

        let element: any = document.elementsFromPoint(event.clientX, event.clientY)[0];
        if (element == null) {
            return;
        }

        const elementId = element.getAttribute("id")
        if (element.getAttribute('blocked') === 'true') {
            logger.debug(`Place id = ${elementId} is blocked.`);
            return;
        }

        if (element.classList.contains(css.seat)) {
            let placePrice = parseInt(element.getAttribute('price'), 10);
            if (element.getAttribute('selected') === 'true') {
                logger.debug(`Place id = ${elementId} was selected. Unselect it.`);
                _changeCircle(element, UNSELECTED_SEAT_RADIUS, false)
                this.state.selectedPlaceList.delete(elementId)
                this.setState({totalPrice: this.state.totalPrice - placePrice});
            } else {
                logger.debug(`Place id = ${elementId} wasn't selected. Select it.`);
                _changeCircle(element, SELECTED_SEAT_RADIUS, true)
                this.state.selectedPlaceList.add(elementId)
                this.setState({totalPrice: this.state.totalPrice + placePrice});
            }
        }
    }

    buyTickets = () => {
        let blockPlacesRequestBody = SeanceSchemaUtils.prepareBlockUnblockPlacesRequestBody(
            this.state.selectedPlaceList, this.state.seanceId)
        this.props.navigation('/seance/payment', {
            state: {blockPlacesRequestBody: blockPlacesRequestBody}
        });
    }

    render() {
        return (
            <div>
                <div>Seance id: {this.state.seanceId} TOTAL PRICE: {this.state.totalPrice}</div>
                <div>SELECTED: {SeanceSchemaUtils.selectedPlaceListToString(this.state.selectedPlaceList)}</div>
                <button type="button" className="btn btn-primary" onClick={this.buyTickets}>Buy tickets</button>
                <br/>
                <svg
                    id="seanceGraphArea" height="800" width="800"
                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    onClick={this.selectThePlace}
                >
                </svg>
            </div>
        );
    }
}

const logger = getLogger(SeanceSchema.name);

export default function SeanceSchema() {
    return <SeanceSchemaClass seanceId={parseInt(String(useParams().seanceId))}
                              navigation={useNavigate()}/>
}