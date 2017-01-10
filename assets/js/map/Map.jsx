import React from 'react';
import L from 'leaflet';
import selectProps from './map-select-props.js';
import { connect } from 'react-redux';
import Spinner from '../spinner.jsx';
require('leaflet-ajax');
require('leaflet-spin');
require('leaflet/dist/leaflet.css');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

var map;

var Map = React.createClass({
    propTypes: {
        is_uploading: React.PropTypes.bool.isRequired,
        dataLayers: React.PropTypes.arrayOf(React.PropTypes.object),
        is_loading_to_map: React.PropTypes.bool.isRequired
    },
    mapOptions: {
      lat: 63.41,
      lng: 10.4,
      zoom: 13,
    },

    componentDidMount: function() {
        let position = [this.mapOptions.lat, this.mapOptions.lng];
        let mapLayer = L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            {subdomains: "abc", maxZoom: 18});
        let mapSettings = {
            layers: [mapLayer],
            attributionControl: false,
            zoomControl: false,
        };
        map = L.map('mapClass', mapSettings).setView(position, this.mapOptions.zoom);
        // map.on('click', this.onMapClick);
        console.log(map);
    },

    componentWillUnmount: function() {
        // map.off('click', this.onMapClick);
        map = null;
    },

    componentDidUpdate: function(prevProps, prevState) {
        console.log(this.props.dataLayers);
        console.log(this.props.dataLayers.length);
        var layers_to_add = _.difference(prevProps.dataLayers, this.props.dataLayers);
        var layers_to_remove = _.difference(prevProps.dataLayers, this.props.dataLayers);
        for (let dataLayer of this.props.dataLayers) {
            if (!map.hasLayer(dataLayer)) {
                this.loadLayerToMap(dataLayer);
            }
        }
        // if(layers_to_add.length > -1) {
        //     for (let dataLayer of layers_to_add) {
        //         if(!map.hasLayer(dataLayer)) {
        //             this.loadLayerToMap(dataLayer);
        //         }
        //     }
        // }
        if(layers_to_remove.length > -1) {
            for (let dataLayer of layers_to_remove) {
                if(map.hasLayer(dataLayer)) {
                    this.hideLayerFromMap(dataLayer);
                }
            }
        }

    },

    // componentWillUpdate: function(nextProps, nextState) {
    //     // console.log(this.props.dataLayers);
    //     // console.log(this.props.dataLayers.length);
    //     var layers_to_add = _.difference(nextProps.dataLayers, this.props.dataLayers);
    //     var layers_to_remove = _.difference(this.props.dataLayers, nextProps.dataLayers);
    //     for (let dataLayer of nextProps.dataLayers) {
    //         if (!map.hasLayer(dataLayer)) {
    //             this.loadLayerToMap(dataLayer);
    //         }
    //     }
    //     if(layers_to_remove.length > -1) {
    //         for (let dataLayer of layers_to_remove) {
    //             if(map.hasLayer(dataLayer)) {
    //                 this.hideLayerFromMap(dataLayer);
    //             }
    //         }
    //     }
    //
    // },



    loadLayerToMap: function(layer) {
        console.log("loading layer");
        // var url = 'getCategoryLayer/'.concat(layer);
        // this.getCategoryLayer(url);
        layer.addTo(map);
    },

    hideLayerFromMap: function(layer) {
        console.log("hiding layer: " + layer);
        map.removeLayer(layer);
    },

    onMapClick: function() {
      //
    },

    shouldSpinnerSpin: function() {

    },


    render: function() {
        return (
          <div className="mapWindow">
            <div className="mapClass" id="mapClass">
            </div>
            <Spinner
              status={this.props.is_loading_to_map} />
          </div>
        )
    }
});

export default connect(selectProps)(Map);
export { Map };
