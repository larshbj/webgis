import * as _ from 'lodash';

const selectStateForProps = function selectStateFromProps(state) {
    let appProps = {};

    appProps.upload_status = _.get(state.map, "upload_status");

    return appProps;
};

export default selectStateForProps;