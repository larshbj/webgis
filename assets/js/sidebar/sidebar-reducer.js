import initialState from './sidebar-initial-state.js';

const _ = require('lodash');

export default function (previousState, action) {

    if (typeof previousState === "undefined") {
        return initialState.getState();
    }

    switch (action.type) {
        case "LOAD_CATEGORIES":
            previousState.layers = action.value;
            return _.assign({}, previousState);
        case "ADD_SIDEBARLAYER":
            previousState.layers = _.concat(previousState.layers, action.value);
            return _.assign({}, previousState);
        case 'START_LOAD_CATEGORIES':
            previousState.incoming_upload = true;
            return _.assign({}, previousState);
        case 'STOP_LOAD_CATEGORIES':
            previousState.incoming_upload = false;
            return _.assign({}, previousState);
    }
    return previousState;
};

