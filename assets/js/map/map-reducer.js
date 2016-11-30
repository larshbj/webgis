import initialState from './map-initial-state.js';

const _ = require('lodash');

export default function (previousState, action) {

    if (typeof previousState === "undefined") {
        return initialState.getState();
    }

    switch (action.type) {
        case 'FILE_UPLOADING':
            previousState.upload_status = "uploading";
            return _.assign({}, previousState)
        case 'UPLOAD_SUCCESSFUL':
            previousState.upload_status = "uploadedSuccessfully";
            return _.assign({}, previousState);
        case 'NEW_GEOJSON_URL':
            previousState.latestGeoJsonURL = action.value;
            return _.assign({}, previousState);
        case 'START_STOP_LOAD_MAP':
            previousState.is_loading_to_map = previousState.is_loading_to_map === false ? true : false;
            return _.assign({}, previousState);
    }
    return previousState;
}
