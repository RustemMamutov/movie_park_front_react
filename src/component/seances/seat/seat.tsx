import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getLogger} from "scripts/log-config";
import css from './seat.module.css';

interface IPlaceProps {
    placeId: number;
    xoffset: number;
    yoffset: number;
    price: number;
    scale: string;
    blocked: boolean;
    vip: boolean;
    selectedHook: Function;
}

interface IPlaceState {
    selected: boolean;
    stylesDict: Record<string, {}>
}

class SeatClass extends Component<IPlaceProps, IPlaceState> {
    constructor(props: IPlaceProps) {
        super(props);

        this.state = {
            selected: false,
            stylesDict: {"blocked" : css.blocked,
                "selected": css.selected,
                "seat": css.seat,
                "vip": css.vip,
            }
        }
    }

    getStyle = (): {} => {
        return {
            // position: "relative",
            position: "absolute",
            left: this.props.xoffset,
            top: this.props.yoffset,
            scale: this.props.scale,
        }
    }

    getClassNames = () => {
        const classNames = []
        classNames.push(this.state.stylesDict["seat"])
        if (this.props.blocked) {
            classNames.push(this.state.stylesDict["blocked"])
        } else {
            classNames.push(this.state.selected ? this.state.stylesDict["selected"] : null)
            classNames.push(this.props.vip ? this.state.stylesDict["vip"] : null)
        }
        return classNames.join(' ')
    }

    changeSelection = () => {
        if (this.state.selected) {
            this.setState({selected: false})
            this.props.selectedHook(this.props.placeId, this.props.price, false)
        } else {
            this.setState({selected: true})
            this.props.selectedHook(this.props.placeId, this.props.price, true)
        }
    }

    doNothing = () => {
        logger.info("Ignore for blocked seat")
    }

    render() {
        logger.info(`Render id:${this.props.placeId} select:${this.state.selected} block:${this.props.blocked}`)
        const onClickFunc = this.props.blocked ? this.doNothing : this.changeSelection;
        return (
            <div style={this.getStyle()} className={this.getClassNames()} onClick={onClickFunc}/>
        );
    }
}

const logger = getLogger(Seat.name);

export default function Seat(props: any) {
    return <SeatClass placeId={props.placeId}
                      xoffset={props.xoffset}
                      yoffset={props.yoffset}
                      price={props.price}
                      scale={props.scale}
                      blocked={props.blocked}
                      vip={props.vip}
                      selectedHook={props.selectedHook}/>
}