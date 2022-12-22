import React, {Component} from 'react';
import {useNavigate} from "react-router-dom";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {getLogger} from "../../../scripts/log-config";

interface IPaymentSuccessProps {
    navigate: NavigateFunction
}

class PaymentSuccessClass extends Component<IPaymentSuccessProps> {
    constructor(props: IPaymentSuccessProps) {
        super(props);

        this.goToStartPage = this.goToStartPage.bind(this);
    }

    goToStartPage() {
        logger.debug("Go to start page");
        this.props.navigate("/");
    }

    render() {
        return (
            <div>
                <h2>Бронирование билетов успешно завершено</h2>
                <button type="button" className="btn btn-success" onClick={this.goToStartPage}>
                    На главную
                </button>
            </div>
        );
    }
}

const logger = getLogger(PaymentSuccess.name);

export default function PaymentSuccess() {
    return <PaymentSuccessClass navigate={useNavigate()}/>
}