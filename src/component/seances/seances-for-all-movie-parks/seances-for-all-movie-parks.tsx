import React, {Component} from 'react';
import SeancesForOneMoviePark from "../seances-for-one-movie-park/seances-for-one-movie-park";
import {getAllSeancesByMovieAndDate} from "../../../scripts/api-methods";
import {MovieInfo, SeanceInfo} from "../../../scripts/data-structures";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getLogger} from "../../../scripts/log-config";

interface ISeancesForAllMovieParksProps {
    navigation: NavigateFunction;
    movieId: number;
    activeDate: string;
    movieInfo: MovieInfo;
}

interface ISeancesForAllMovieParksState {
    movieId: number;
    activeDate: string;
    movieInfo: MovieInfo;
    movieParkNames: string[]
    seanceDict: Map<string, SeanceInfo[]>
}

class SeancesForAllMovieParksClass extends Component<ISeancesForAllMovieParksProps, ISeancesForAllMovieParksState> {
    constructor(props: ISeancesForAllMovieParksProps) {
        super(props);

        this.state = {
            movieId: props.movieId,
            activeDate: props.activeDate,
            movieInfo: props.movieInfo,
            movieParkNames: [],
            seanceDict: new Map<string, SeanceInfo[]>()
        }
    }

    async componentDidMount() {
        const seanceDict: Map<string, SeanceInfo[]> = await getAllSeancesByMovieAndDate(this.state.movieId, this.state.activeDate)
        logger.debug("seanceDict", seanceDict)
        this.setState({seanceDict: seanceDict});
        this.setState({movieParkNames: Array.from(seanceDict.keys())});
    }

    showHeader() {
        return (
            <h3>Расписание сеансов "{this.state.movieInfo.movieName}"</h3>
        )
    }

    showSeancesForEachMoviePark() {
        if (this.state.movieParkNames.length > 0) {
            return (
                this.state.movieParkNames.map(movieParkName => {
                        logger.debug(`movieParkName: ${movieParkName} seanceList:`, this.state.seanceDict.get(movieParkName))
                        return (
                            <SeancesForOneMoviePark
                                movieParkName={movieParkName}
                                seanceList={this.state.seanceDict.get(movieParkName) as SeanceInfo[]}
                            />
                        )
                    }
                )
            )
        }
    }

    render() {
        return (
            <div>
                {this.showHeader()}
                <br/>
                {this.showSeancesForEachMoviePark()}
            </div>
        );
    }
}

const logger = getLogger(SeancesForAllMovieParks.name);

export function SeancesForAllMovieParks() {
    return <SeancesForAllMovieParksClass movieInfo={useLocation().state.movieInfo}
                                         activeDate={String(useParams().activeDate)}
                                         movieId={parseInt(String(useParams().movieId))}
                                         navigation={useNavigate()}/>
}
