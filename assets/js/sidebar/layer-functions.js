import * as sidebarActions from './sidebar-actions.js';
var randomColor = require('randomcolor');
const _ = require('lodash');
var leaflet_id_mapping = {};
var selectedFeatures = [];
var layers_features = [];
var layerNames;

export function createIntersection(layers) {
    let layer_one = layers[0]
    let layer_two = layers[1]
    $.ajax({
        url : "/create_intersection/",
        type : "POST",
        data : {
            'layer_one_ids': JSON.stringify(getLayerIDs(layer_one.dataLayer)),
            'layer_two_ids': JSON.stringify(getLayerIDs(layer_two.dataLayer)),
            'layer_names': JSON.stringify(getLayerNames(layers))
        },

        success: function(data) {
            var result = JSON.parse(data);
            var category = result['category'];
            sidebarActions.sendAddSidebarLayer(category);
        }.bind(this),

        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

export function createDifference(layers) {
    let first_layer = layers[0]
    let second_layer = layers[1]
    $.ajax({
        url: "/create_difference/",
        type: "POST",
        data : {
            'first_layer': JSON.stringify(getLayerIDs(first_layer.dataLayer)),
            'second_layer': JSON.stringify(getLayerIDs(second_layer.dataLayer)),
            'layer_names': JSON.stringify(getLayerNames(layers))
        },

        success: function(data) {
            var result = JSON.parse(data);
            var category = result['category'];
            var featureCollection = result['featureCollection'];
            sidebarActions.sendAddSidebarLayer(category);
        }.bind(this),

        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

export function createUnion(layers) {
    $.ajax({
        url: "/create_union/",
        type: "POST",
        data : {
            'layer_ids': JSON.stringify(getAllLayerIDs(layers)),
            'layer_names': JSON.stringify(getLayerNames(layers))
        },

        success: function(data) {
            var result = JSON.parse(data);
            var category = result['category'];
            var featureCollection = result['featureCollection'];
            sidebarActions.sendAddSidebarLayer(category);
        }.bind(this),

        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

//TODO: maybe support for creating multiple buffers simultaneously
export function createBuffer(layers) {
    let sidebarLayer = layers[0]; // will always be length one
    $.ajax({
        url: "/create_buffer/",
        type: "POST",
        data : {
            'buffer_distance': 100,
            'layer_ids': JSON.stringify(getLayerIDs(sidebarLayer.dataLayer)),
            'category': sidebarLayer.props.layerName,
        },

        success: function(data) {
            var result = JSON.parse(data);
            var category = result['category'];
            var featureCollection = result['featureCollection'];
            sidebarActions.sendAddSidebarLayer(category);
        }.bind(this),

        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

export function getLayerNames(layers) {
    layerNames = [];
    for (let l in layers) {
        var layer = layers[l];
        layerNames = _.concat(layerNames, layer.props.layerName);
    }
    return layerNames;
}


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
        // if(target_layer._layers) {
        //     var match = target_layer.eachLayer(function(layer) {
        //         dataLayer.resetStyle(layer);
        //     });
        // } else {
        //TODO: support for multiple sub-layers
          dataLayer.resetStyle(target_layer);
        // }
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
            // if (target_layer._layers) {
            //     console.log('TARGET HAVE LAYERS');
            //     target_layer.eachLayer(function(layer) {
            //         dataLayer.resetStyle(layer);
            //     });
            // } else {
            //TODO: support for multiple sub-layers
              console.log('TARGET NO LAYERS')
              dataLayer.resetStyle(target_layer);
            // }
        } else {
          console.log('dette skal aldri skje');
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

export function getAllLayerIDs(dataLayers) {
    layers_features = [];
    for (let l in dataLayers) {
        var layer = dataLayers[l];
        layers_features = _.union(layers_features, getLayerIDs(layer.dataLayer))
    }
    return layers_features;
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
