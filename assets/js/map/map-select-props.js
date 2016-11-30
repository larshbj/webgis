const _ = require('lodash');

export default function selectProps(state) {
    return {
        upload_status: _.get(state.map, "upload_status"),
        latestGeoJsonURL: _.get(state.map, "latestGeoJsonURL"),
        is_loading_to_map: _.get(state.map, "is_loading_to_map")
    };
}
