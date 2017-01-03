import React from 'react';
import ReactDOM from 'react-dom';
import Store from './store.js';
import { Provider } from 'react-redux';
import AppConnector from './AppConnector.jsx';
import {dbBridge} from './dbBridge.js';
import {syncHistoryWithStore} from 'react-router-redux';
import { Router, Route, browserHistory } from 'react-router';

dbBridge.init();
const history = syncHistoryWithStore(browserHistory, Store);

ReactDOM.render(
    <Provider store={Store}>
        <Router history={history}>
          <Route path="/" component={AppConnector}>
            // <Route path="foo" component={Foo}/>
            // <Route path="bar" component={Bar}/>
          </Route>
        </Router>
    </Provider>,
    document.getElementById('react-app')
);
// }
