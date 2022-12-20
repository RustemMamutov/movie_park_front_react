import React, {Component} from 'react';
import {useNavigate} from 'react-router-dom'
import css from "./movie.module.css";
import GeneralUtils from "../../../scripts/general-utils";
import {MovieInfo} from "../../../scripts/api-methods";

function log(...args: any[]) {
    GeneralUtils.log("SingleMovie", ...args)
}

interface IMovieProps {
    navigation: any
    movieInfo: MovieInfo
    activeDateStr: string
}

interface IMovieState {
    imgIndex: number
}

class SingleMovieClass extends Component<IMovieProps, IMovieState> {
    constructor(props: IMovieProps) {
        super(props);

        this.goToSeances = this.goToSeances.bind(this);

        this.state = {
            imgIndex: this.getRandomIndex()
        }
    }

    goToSeances() {
        this.props.navigation(
            `/seance/date/${this.props.activeDateStr}/movie_id/${this.props.movieInfo.movieId}`,
            {
                state: {movieInfo: this.props.movieInfo}
            }
        )
    }

    getRandomIndex() {
        return Math.floor(Math.random() *
            Math.floor(this.props.movieInfo.imgList.length)
        );
    }

    show_movie() {
        return (
            <div className={css.movie_wrapper}>
                <button className={css.movie_img_wrapper_button} onClick={this.goToSeances}>
                    <img className={css.movie_img}
                         src={this.props.movieInfo.imgList[this.state.imgIndex]}/>
                </button>
                <div className={css.movie_name_text}>{this.props.movieInfo.movieName}</div>
            </div>
        )
    }

    render() {
        return (
            this.show_movie()
        )
    }
}

function SingleMovie(props: any) {
    return <SingleMovieClass activeDateStr={props.activeDateStr}
                             movieInfo={props.movieInfo}
                             navigation={useNavigate()}/>
}

export default SingleMovie