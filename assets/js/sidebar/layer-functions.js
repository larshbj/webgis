var randomColor = require('randomcolor');
var leaflet_id_mapping = {};
var selectedFeatures = [];

export function highlightFeature(layer) {
    let feature = layer.feature;
    if (!(selectedFeatures.includes(feature.properties.pk))) {
        layer.setStyle({
            color: '#faeda0',
            weight: 5,
            opacity: 1,
            fillOpacity: 0.8,
        });
    }
}

export function resetHighlightFeature(target_layer, dataLayer) {
    let feature = target_layer.feature;
    if(typeof feature === "undefined") {
        console.log("undefined feature");
        return
    }
    if (!(selectedFeatures.includes(feature.properties.pk))) {
        if(target_layer._layers) {
            var match = target_layer.eachLayer(function(layer) {
                dataLayer.resetStyle(layer);
            });
        } else {
            dataLayer.resetStyle(target_layer);
        }
    }
}


export function saveFeatureColors(layer) {
    var match = layer.eachLayer(function(layer) {
        leaflet_id_mapping[layer.feature.properties.pk] = layer._leaflet_id;
        if (typeof layer._layers !== "undefined") {
            // saveSubFeatureColors(layer);
        } else {
            layer.feature.properties.color = layer.options.color;
        }
    });
}

export function toggleSelectFeature(target_layer, dataLayer) {
    let feature = target_layer.feature;
    let feature_id = feature.properties.pk;
    if (selectedFeatures.includes(feature_id)) {
        selectedFeatures = _.without(selectedFeatures, feature_id);
        if (!selectedFeatures.includes(feature.properties.pk)) {
            if (target_layer._layers) {
                var match = target_layer.eachLayer(function(layer) {
                    dataLayer.resetStyle(layer);
                });
            } else {
                dataLayer.resetStyle(target_layer);
            }
        }
    } else {
        selectedFeatures.push(feature_id);
        toggleSelectLayer(target_layer);
    }
}

export function selectAllFeatures(dataLayer) {
    if(!dataLayer._layers) {
        return;
    }
    for (let l in dataLayer._layers) {
        var layer = dataLayer._layers[l];
        toggleSelectFeature(layer, dataLayer);
    }
}

export function getLayerIDs(dataLayer) {
    if(!dataLayer._layers) {
        return;
    }
    var ids = [];
    for (let l in dataLayer._layers) {
        var layer = dataLayer._layers[l];
        let feature = layer.feature;
        let feature_id = feature.properties.pk;
        ids.push(feature_id);
    }
    return ids;

}

export function deSelectAllFeatures(dataLayer) {
    if(!dataLayer._layers) {
        return;
    }
    for (let l in dataLayer._layers) {
        var layer = dataLayer._layers[l];
        // for (let feature in layer) {
        //     selectedFeatures.push(feature.properties.pk);
        // }
        toggleSelectFeature(layer, dataLayer);
    }
}

// export function getFeatureStyle(feature, layer, color) {
//     let layerColor = layerFunctions.generateRandomColor(color);
//     if ((typeof feature !== 'undefined') && (typeof feature.properties !== 'undefined') && (typeof feature.properties.color !== 'undefined')) {
//         layerColor = feature.properties.color
//     }
//     return {
//         fillColor: layerColor,
//         color: layerColor,
//         weight: 3,
//         fillOpacity: 0.7,
//         opacity: 0.7
//     };
// }

function toggleSelectLayer(target_layer) {
    target_layer.setStyle({
        fillColor: "#ff3c14",
        color: "#faeda0",
        weight: 5,
        opacity: 0.9,
        fillOpacity: 0.9
    });
}

function saveSubFeatureColors(sub_layers) {
    var match = sub_layers.eachLayer(function(layer) {
        layer.feature = {};
        layer.feature.properties = {};
        layer.feature.properties.color = layer.options.color;
    });
}

export function generateRandomColor(baseColor) {
    return randomColor({
        hue: baseColor
    });
}
