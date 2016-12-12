import React from 'react';
import ReactDOM from 'react-dom';
import Store from './store.js';
import { Provider } from 'react-redux';
import AppConnector from './AppConnector.jsx';
import {dbBridge} from './dbBridge.js';

dbBridge.init();

ReactDOM.render(
    <Provider store={Store}>
        <AppConnector />
    </Provider>,
    document.getElementById('react-app')
);
// }
