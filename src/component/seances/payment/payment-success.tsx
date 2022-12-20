import React, {Component} from 'react';
import {useNavigate} from "react-router-dom";
import GeneralUtils from "../../../scripts/general-utils";
import {NavigateFunction} from "react-router/dist/lib/hooks";

function log(...args: any[]) {
    GeneralUtils.log(PaymentSuccessClass.name, ...args)
}

interface IPaymentSuccessProps {
    navigate: NavigateFunction
}

class PaymentSuccessClass extends Component<IPaymentSuccessProps> {
    constructor(props: IPaymentSuccessProps) {
        super(props);

        this.goToStartPage = this.goToStartPage.bind(this);
    }

    goToStartPage() {
        log("Go to start page");
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

function PaymentSuccess() {
    return <PaymentSuccessClass navigate={useNavigate()}/>
}

export default PaymentSuccess