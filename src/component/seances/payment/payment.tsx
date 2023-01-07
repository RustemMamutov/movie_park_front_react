import React, {Component} from 'react';
import {blockPlaces} from "scripts/api-methods";
import {useLocation, useNavigate} from "react-router-dom";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {getLogger} from "scripts/log-config";

interface IPaymentProps {
    navigation: NavigateFunction;
    blockPlacesRequestBody: {}
}


class PaymentClass extends Component<IPaymentProps> {
    constructor(props: IPaymentProps) {
        super(props);
    }

    payAndBlockPlaces = async () => {
        logger.debug("payment processed");
        logger.debug("Blocking places", this.props.blockPlacesRequestBody);
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

const logger = getLogger(Payment.name);

export default function Payment() {
    return <PaymentClass blockPlacesRequestBody={useLocation().state.blockPlacesRequestBody}
                         navigation={useNavigate()}/>
}