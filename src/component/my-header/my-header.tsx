import React from 'react';
import css from './my-header.module.css';

const MyHeader = () => {
    return (
        <header className={css.header}>
            <br/>
            <div className={css.text}>this is header</div>
        </header>
    )
}

export default MyHeader;