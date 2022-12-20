import React, {Component} from 'react';
import {useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeneralUtils from "../../../scripts/general-utils";
import {SeanceInfo} from "../../../scripts/api-methods";
import {NavigateFunction} from "react-router/dist/lib/hooks";

function log(...args: any[]) {
    GeneralUtils.log("SeanceButton", ...args)
}

interface ISeanceButtonProps {
    navigation: NavigateFunction;
    seanceInfo: SeanceInfo;
}

export class SeanceButtonClass extends Component<ISeanceButtonProps> {
    constructor(props: ISeanceButtonProps) {
        super(props);

        this.goToSeance = this.goToSeance.bind(this);
    }

    goToSeance() {
        this.props.navigation(`/seance/id/${this.props.seanceInfo.seanceId}`, {
            state: {seanceInfo: this.props.seanceInfo}
        });
    }

    showTimeHHMMFormat(timeAsString: string) {
        return timeAsString.substring(0, timeAsString.lastIndexOf(":"));
    }

    render() {
        log("seanceInfo: ", this.props.seanceInfo)
        return (
            <button type="button" className="btn btn-success" onClick={this.goToSeance}>
                {this.showTimeHHMMFormat(this.props.seanceInfo.startTime)}
            </button>
        );
    }
}

function SeanceButton(props: any) {
    return <SeanceButtonClass seanceInfo={props.seanceInfo} navigation={useNavigate()}/>
}

export default SeanceButton