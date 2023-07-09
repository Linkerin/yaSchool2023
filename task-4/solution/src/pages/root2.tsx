import React from 'react';
import I18NTask from "../i18n/I18NTask";

import {LinkEntity} from '../entities/link2';
import {LinkComponent} from '../components/Link2';

const App2 = () => {
    return (
        <p>
            <div>{LinkComponent}</div>
            <div>{LinkEntity}</div>
            <I18NTask />
        </p>
    )
};

export default App2;
