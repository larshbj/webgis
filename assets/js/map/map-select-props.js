const _ = require('lodash');

export default function selectProps(state) {
    return {
        upload_status: _.get(state.map, "upload_status"),
    };
}
