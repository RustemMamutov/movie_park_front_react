import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./seances-for-one-movie-park.module.css";
import SeanceButton from "../seance-button/seance-button";
import {SeanceInfo} from "../../../scripts/api-methods";
import {getLogger} from "../../../scripts/log-config";

const COLUMNS_COULD = 5

interface ISeancesForOneMovieParkProps {
    seanceList: SeanceInfo[]
    movieParkName: string
}

interface ISeancesForOneMovieParkState {
    sortedSeanceList: SeanceInfo[]
}

export class SeancesForOneMoviePark extends Component<ISeancesForOneMovieParkProps, ISeancesForOneMovieParkState> {

    constructor(props: ISeancesForOneMovieParkProps) {
        super(props);

        this.state = {
            sortedSeanceList: []
        }
    }

    static getDerivedStateFromProps(props: ISeancesForOneMovieParkProps) {
        function toDate(seanceInfo: SeanceInfo): Date {
            return new Date(`${seanceInfo.seanceDate} ${seanceInfo.startTime}`)
        }

        let sortedSeanceList = Object.assign([], props.seanceList);
        logger.trace("seancesByDateAndMovie before sort:", sortedSeanceList)
        sortedSeanceList.sort(function (a: any, b: any) {
            let date1 = toDate(a);
            let date2 = toDate(b);
            if (date1 > date2) return 1;
            else if (date1 === date2) return 0;
            else return -1;
        });
        logger.debug("seancesByDateAndMovie after sort:", sortedSeanceList)
        return {sortedSeanceList: sortedSeanceList};
    }

    showSeanceButton(index: number) {
        if (this.state.sortedSeanceList[index] != null) {
            return <SeanceButton seanceInfo={this.state.sortedSeanceList[index]}/>
        }
    }

    showSeanceButtons(row: number) {
        let baseIndex = COLUMNS_COULD * row;
        return (
            <div className={css.seances_row}>
                {COLUMNS_COULD >= 1 ? this.showSeanceButton(baseIndex) : null}
                {COLUMNS_COULD >= 2 ? this.showSeanceButton(baseIndex + 1) : null}
                {COLUMNS_COULD >= 3 ? this.showSeanceButton(baseIndex + 2) : null}
                {COLUMNS_COULD >= 4 ? this.showSeanceButton(baseIndex + 3) : null}
                {COLUMNS_COULD >= 5 ? this.showSeanceButton(baseIndex + 4) : null}
                {COLUMNS_COULD >= 6 ? this.showSeanceButton(baseIndex + 5) : null}
                {COLUMNS_COULD >= 7 ? this.showSeanceButton(baseIndex + 6) : null}
            </div>
        )
    }

    show_seances() {
        let seanceList = this.state.sortedSeanceList
        let rowsList: number[] = []
        logger.debug("seanceList.length", seanceList.length, "Math", Math.ceil(seanceList.length / COLUMNS_COULD))
        for (let i = 0; i < Math.ceil(seanceList.length / COLUMNS_COULD); i++) {
            rowsList.push(i)
        }
        logger.debug("rowsList", rowsList)
        if (seanceList.length > 0) {
            return (
                <div className="row" id={"row_" + this.props.movieParkName}>
                    <div className="col-4" id={"leftColumn_" + this.props.movieParkName}>
                        <div className={css.movie_park_text}>{this.props.movieParkName}</div>
                    </div>
                    <div className="col-8" id={"rightColumn_" + this.props.movieParkName}>
                        {rowsList.map(row => {
                            return this.showSeanceButtons(row)
                        })}
                    </div>
                </div>
            )
        }

        logger.debug("empty")
    }

    render() {
        return (
            <>{this.show_seances()}</>
        );
    }
}

const logger = getLogger(SeancesForOneMoviePark.name);

export default SeancesForOneMoviePark;
