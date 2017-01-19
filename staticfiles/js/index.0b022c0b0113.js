import React from 'react';
import ReactDOM from 'react-dom';
import Store from './store.js';
import { Provider } from 'react-redux';
import AppConnector from './AppConnector.jsx';
import {dbBridge} from './dbBridge.js';
import {syncHistoryWithStore} from 'react-router-redux';
import { Router, Route, browserHistory } from 'react-router';
require('../sass/app.scss');


dbBridge.init();
const history = syncHistoryWithStore(browserHistory, Store);

// function init() {
//   dbBridge.init();
// }
//
// init();

ReactDOM.render(
    <Provider store={Store}>
        <Router history={history}>
          <Route path="/" component={AppConnector}>
          </Route>
        </Router>
    </Provider>,
    document.getElementById('react-app')
);
// }
