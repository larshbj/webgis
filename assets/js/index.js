import React from 'react';
import ReactDOM from 'react-dom';
// import Store from './store.js';
// import { Provider } from 'react-redux';
// import AppConnector from './components/AppConnector.jsx';
import App from './App.jsx';
// function initialize() {

    // ReactDOM.render(
    //     <Provider store={Store}>
    //             <AppConnector />
    //     </Provider>,
    //     document.getElementById('react-app')
    // );
ReactDOM.render(
    <App />,
    document.getElementById('react-app')
);
// }
