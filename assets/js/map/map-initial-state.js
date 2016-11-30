export default {
    getState: function () {
        return {
            upload_status: "waitingForUpload",
            latestGeoJsonURL: "/load_layers/",
            is_loading_to_map: false
        };
    }
};
