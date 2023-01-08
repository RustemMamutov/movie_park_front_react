import React, {Component, MouseEvent} from 'react';
import {getAllMoviesByIdSet, getMovieListByPeriod, SeanceInfo} from 'scripts/api-methods'
import {MovieInfo} from 'scripts/data-structures'
import css from './movies.module.css'
import SingleMovie from "./movie/single-movie";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {useNavigate} from "react-router-dom";
import {getLogger} from "scripts/log-config";

const COLUMNS_COULD = 3

interface IMoviesProps {
    navigation: NavigateFunction;
    activeDateStr: string
    activeDateList: string[]
}

interface IMoviesState {
    X: number
    Y: number
    firstDateStr: string
    secondDateStr: string
    seanceInfo: Object
    movieByDateMap: Map<string, Map<number, string>>
    movieIdSet: Set<number>
    activeDateMovies: Map<number, string>
    movieInfoDict: Map<number, MovieInfo>
}

class MoviesClass extends Component<IMoviesProps, IMoviesState> {
    constructor(props: IMoviesProps) {
        super(props);

        this.state = {
            X: 0,
            Y: 0,
            firstDateStr: props.activeDateList[0],
            secondDateStr: props.activeDateList[this.props.activeDateList.length - 1],
            seanceInfo: SeanceInfo,
            movieByDateMap: new Map<string, Map<number, string>>(),
            movieIdSet: new Set<number>(),
            activeDateMovies: new Map<number, string>(),
            movieInfoDict: new Map<number, MovieInfo>()
        }
    }

    static getDerivedStateFromProps(props: IMoviesProps, state: IMoviesState) {
        return {
            activeDateMovies: state.movieByDateMap.get(props.activeDateStr) as Map<number, string>
        };
    }

    handleMouseMove = (event: MouseEvent) => {
        // this.setState({
        //     X: event.clientX,
        //     Y: event.clientY
        // });
    }

    async componentDidMount() {
        logger.debug(`firstDateStr: ${this.state.firstDateStr} secondDateStr ${this.state.secondDateStr} activeDateStr ${this.props.activeDateStr}`)

        const movieByDateMap: Map<string, Map<number, string>> =
            await getMovieListByPeriod(this.state.firstDateStr, this.state.secondDateStr)
        logger.debug("movieByDateMap", movieByDateMap)
        logger.debug("activeDateMovies", movieByDateMap.get(this.props.activeDateStr))
        this.setState({movieByDateMap: movieByDateMap});
        this.setState({
            activeDateMovies: movieByDateMap.get(this.props.activeDateStr) as Map<number, string>
        })

        const movieIdSet = new Set<number>()
        movieByDateMap.forEach(
            (movieMap, date) => {
                logger.debug("date", date, "movieMap", movieMap)
                Object.keys(movieMap).forEach(movieId => {
                    movieIdSet.add(parseInt(movieId));
                })
            })

        this.setState({movieIdSet: movieIdSet})
        logger.debug("movieIdSet:", movieIdSet)

        const movieInfoDict = await getAllMoviesByIdSet(movieIdSet)
        logger.debug("movieInfoDict", movieInfoDict)
        this.setState({movieInfoDict: movieInfoDict})
    }

    showOneMovie(index: number, movieIdList: number[]) {
        if (index + 1 <= movieIdList.length) {
            const movieInfo = this.state.movieInfoDict.get(movieIdList[index])
            if (movieInfo === undefined) {
                return (
                    <h3>Данные ещё не прогрузились</h3>
                )
            } else {
                return (
                    <SingleMovie movieInfo={movieInfo} activeDateStr={this.props.activeDateStr}/>
                )
            }
        }
    }

    showAllMovies() {
        if (this.state.activeDateMovies === undefined) {
            return (
                <div>
                    <h3>Список фильмов пуст. Возможно, проблема в backend части.</h3>
                </div>
            )
        }
        const movieIdList = Object.keys(this.state.activeDateMovies).map(
            function (key) {
                return parseInt(key)
            }
        )
        const rows_array = []
        for (let i = 0; i < Math.ceil(movieIdList.length / 3); i++) {
            rows_array.push(i)
        }

        if (movieIdList.length > 0) {
            return (
                rows_array.map(row => {
                        const baseIndex = COLUMNS_COULD * row;
                        return (
                            <div className={css.movies_row}>
                                {this.showOneMovie(baseIndex, movieIdList)}
                                {this.showOneMovie(baseIndex + 1, movieIdList)}
                                {this.showOneMovie(baseIndex + 2, movieIdList)}
                            </div>
                        )
                    }
                )
            )
        }
    }

    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                <div>
                    <b>MyMovies. Coordinates X: {this.state.X} Y: {this.state.Y}</b>
                </div>
                {this.showAllMovies()}
            </div>
        );
    }
}

const logger = getLogger(Movies.name);

export default function Movies(props: any) {
    return <MoviesClass activeDateStr={props.activeDateStr}
                        activeDateList={props.activeDateList}
                        navigation={useNavigate()}/>
}