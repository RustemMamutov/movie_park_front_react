import React, {Component} from 'react';
import css from './main-content.module.css';
import Movies from "component/movies/movies";
import GeneralUtils from "scripts/general-utils";
import Calendar from "component/calendar/calendar";
import {useParams} from "react-router-dom";
import {getLogger} from "scripts/log-config";

interface IMainContentProps {
    activeDateStr: string
}

interface IMainContentState {
    X: number;
    Y: number;
    activeDateStr: string;
    dateList: string[]
}

class MainContentClass extends Component<IMainContentProps, IMainContentState> {
    constructor(props: IMainContentProps) {
        super(props);

        this.state = {
            X: 0,
            Y: 0,
            activeDateStr: props.activeDateStr,
            dateList: []
        }
    }

    static getDerivedStateFromProps(props: IMainContentProps, state: IMainContentState) {
        if (state.dateList.length === 0) {
            let dateList: string[] = []
            let activeDate = GeneralUtils.stringToDate(props.activeDateStr)
            for (let i = 0; i <= 7; i++) {
                let currDateStr = GeneralUtils.dateToString(activeDate)
                dateList.push(currDateStr);
                activeDate.setDate(activeDate.getDate() + 1)
            }
            return {dateList: dateList};
        } else {
            return {activeDateStr: state.activeDateStr};
        }
    }

    handleMouseMove = (event: any) => {
        this.setState({
            X: event.clientX,
            Y: event.clientY
        });
    }

    setActiveDate = (_activeDate: string) => {
        logger.debug("setActiveDate", _activeDate)
        this.setState({activeDateStr: _activeDate})
    }

    showCalendar() {
        return (
            <Calendar setActiveDate={this.setActiveDate}
                      activeDate={this.state.activeDateStr}
                      activeDateList={this.state.dateList}/>
        )
    }

    showContent() {
        if (this.state.activeDateStr === undefined) {
            return null;
        }

        return (
            <Movies activeDateStr={this.state.activeDateStr}
                    activeDateList={this.state.dateList}/>
        )
    }

    render() {
        return (
            <div className={css.content} onMouseMove={this.handleMouseMove}>
                <div>current active date: {this.state.activeDateStr}</div>
                {this.showCalendar()}
                <br/>
                <b>MyMainContent. Coordinates X: {this.state.X} Y: {this.state.Y}</b>
                {this.showContent()}
            </div>
        )
    }
}

const logger = getLogger(MainContent.name);

export default function MainContent() {
    return <MainContentClass activeDateStr={String(useParams().activeDate)}/>
}
