const _ = require('lodash');

export default function selectProps(state) {
    return {
        is_uploading: _.get(state.map, "is_uploading"),
        dataLayers: _.get(state.map, "dataLayers"),
        is_loading_to_map: _.get(state.map, "is_loading_to_map")
    };
}
