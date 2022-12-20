import React, {Component} from 'react';
import GeneralUtils from "../../../scripts/general-utils";
import {blockPlaces} from "../../../scripts/api-methods";
import {useLocation, useNavigate} from "react-router-dom";
import {NavigateFunction} from "react-router/dist/lib/hooks";

function log(...args: any[]) {
    GeneralUtils.log(PaymentClass.name, ...args)
}

interface IPaymentProps {
    navigation: NavigateFunction;
    blockPlacesRequestBody: {}
}


class PaymentClass extends Component<IPaymentProps> {
    constructor(props: IPaymentProps) {
        super(props);

        this.payAndBlockPlaces = this.payAndBlockPlaces.bind(this);
    }

    async payAndBlockPlaces() {
        log("payment processed");
        log("Blocking places", this.props.blockPlacesRequestBody);
        await blockPlaces(this.props.blockPlacesRequestBody)
        this.props.navigation("/seance/payment/success");
    }

    render() {
        return (
            <div>
                <h3>There will be payment form</h3>
                <button type="button" className="btn btn-success" onClick={this.payAndBlockPlaces}>
                    Оплатить
                </button>
            </div>
        );
    }
}

function Payment() {
    return <PaymentClass blockPlacesRequestBody={useLocation().state.blockPlacesRequestBody}
                         navigation={useNavigate()}/>
}

export default Payment