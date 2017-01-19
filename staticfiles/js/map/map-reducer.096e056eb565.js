import initialState from './map-initial-state.js';

const _ = require('lodash');

export default function (previousState, action) {

    if (typeof previousState === "undefined") {
        return initialState.getState();
    }

    switch (action.type) {
        case 'START_UPLOAD_TO_DB':
            previousState.is_uploading = true;
            return _.assign({}, previousState);
        case 'FINISHED_UPLOAD_TO_DB':
            previousState.is_uploading = false;
            return _.assign({}, previousState);
        case 'SPINNER_START':
            previousState.is_loading_to_map = true;
            return _.assign({}, previousState);
        case 'SPINNER_STOP':
            previousState.is_loading_to_map = false;
            return _.assign({}, previousState);
        case 'ADD_LAYER':
            console.log("reducer says: " + action.value);
            previousState.dataLayers = _.concat(previousState.dataLayers, action.value);
            return _.assign({}, previousState);
        case 'REMOVE_LAYER':
            previousState.dataLayers = _.without(previousState.dataLayers, action.value);
            return _.assign({}, previousState);
    }
    return previousState;
}
