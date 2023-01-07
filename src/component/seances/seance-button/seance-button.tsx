import React, {Component} from 'react';
import {useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import {SeanceInfo} from "scripts/api-methods";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {getLogger} from "scripts/log-config";

interface ISeanceButtonProps {
    navigation: NavigateFunction;
    seanceInfo: SeanceInfo;
}

class SeanceButtonClass extends Component<ISeanceButtonProps> {
    constructor(props: ISeanceButtonProps) {
        super(props);
    }

    goToSeance = () => {
        this.props.navigation(`/seance/id/${this.props.seanceInfo.seanceId}`, {
            state: {seanceInfo: this.props.seanceInfo}
        });
    }

    showTimeHHMMFormat(timeAsString: string) {
        return timeAsString.substring(0, timeAsString.lastIndexOf(":"));
    }

    render() {
        logger.debug("seanceInfo:", this.props.seanceInfo)
        return (
            <button type="button" className="btn btn-success" onClick={this.goToSeance}>
                {this.showTimeHHMMFormat(this.props.seanceInfo.startTime)}
            </button>
        );
    }
}

const logger = getLogger(SeanceButton.name);

export default function SeanceButton(props: any) {
    return <SeanceButtonClass seanceInfo={props.seanceInfo} navigation={useNavigate()}/>
}