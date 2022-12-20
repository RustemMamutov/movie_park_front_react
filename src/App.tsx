import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from './App.module.css';
import PaymentSuccess from "./component/seances/payment/payment-success";
import {Navigate, Route, Routes} from 'react-router-dom'
import Payment from "./component/seances/payment/payment";
import SeanceSchema from "./component/seances/seance-schema/seance-schema";
import {SeancesForAllMovieParks} from "./component/seances/seances-for-all-movie-parks/seances-for-all-movie-parks";
import MainContent from "./component/main-content/main-content";
import MyHeader from "./component/my-header/my-header";
import MyFooter from "./component/my-footer/my-footer";
import GeneralUtils from "./scripts/general-utils";


function App() {
    return (
        <div className={css.app_wrapper}>
            <MyHeader/>
            <Routes>
                <Route path='/movies/date/:activeDate' element={<MainContent/>}/>
                <Route path='/seance/date/:activeDate/movie_id/:movieId'
                       element={<SeancesForAllMovieParks/>}/>
                <Route path="/seance/id/:seanceId" element={<SeanceSchema/>}/>
                <Route path="/seance/payment/" element={<Payment/>}/>
                <Route path="/seance/payment/success" element={<PaymentSuccess/>}/>
                <Route path="/" element=
                    {<Navigate replace to={`/movies/date/${GeneralUtils.todayDateStr()}`} />}
                />
            </Routes>
            <MyFooter/>
        </div>
    );
}

export default App;
