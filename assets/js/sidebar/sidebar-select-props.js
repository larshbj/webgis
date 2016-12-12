const _ = require('lodash');

export default function selectProps(state) {
    return {
        layers: _.get(state.sidebar, "layers"),
        incoming_upload: _.get(state.sidebar, "incoming_upload")
    };
};
