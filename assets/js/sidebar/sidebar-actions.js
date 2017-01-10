import Store from '../store.js';

export function addLayerToMap(layer) {
    var dataLayer = layer.state.layerData;
    // console.log(dataLayer);
    console.log("ADDING LAYER");
    // console.log(typeof dataLayer);
    // var dataLayer = layer.props.layerName;
    Store.dispatch({
        type: "ADD_LAYER",
        value: dataLayer
    })
}

export function removeLayerFromMap(layer) {
    var dataLayer = layer.state.layerData;
    console.log("REMOVING LAYER");
    Store.dispatch({
        type: "REMOVE_LAYER",
        value: dataLayer
    })
}

export function sendFileAdded() {
    Store.dispatch({
        type: "FILE_ADDED"
    });
}

export function sendFileIsUploading() {
    Store.dispatch({
        type: "START_UPLOAD_TO_DB"
    });
}

export function sendFileIsFinished() {
    Store.dispatch({
        type: "FINISHED_UPLOAD_TO_DB"
    })
}

export function sendStartLoadCategories() {
    Store.dispatch({
        type: "START_LOAD_CATEGORIES"
    });
}

export function sendStopLoadCategories() {
    Store.dispatch({
        type: "STOP_LOAD_CATEGORIES"
    });
}

export function sendLoadCategories(data) {
    Store.dispatch({
        type: "LOAD_CATEGORIES",
        value: data
    });
}

export function sendAddSidebarLayer(data) {
    Store.dispatch({
        type: "ADD_SIDEBARLAYER",
        value: data
    });
}

export function sendActiveLayerChange(layer) {
    Store.dispatch({
        type: "LAYER_ACTIVE_CHANGE",
        value: layer
    })
}
