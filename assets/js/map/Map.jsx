import React from 'react';
import L from 'leaflet';
import selectProps from './map-select-props.js';
import { connect } from 'react-redux';
require('leaflet-ajax')
require('leaflet-spin')
require('../../sass/map.scss');
require('leaflet/dist/leaflet.css');
const path = require('path');
// const EventEmitter = require('events');
// const sideBarDropZone = require('./sidebar/sidebar-dropzone');

var myStyle = {
    "color": "red",
    "weight": 35,
    "opacity": 1,
};

var map;
let myLayer;
var basepath = path.dirname(path.dirname(path.dirname(document.currentScript.src)));


var Map = React.createClass({
    propTypes: {
        upload_status: React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
        return {
            lat: 63.41,
            lng: 10.4,
            zoom: 13,
        };
    },

    componentDidMount: function() {
        let position = [this.state.lat, this.state.lng];
        let mapLayer = L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            {subdomains: "abc", maxZoom: 18});
        let mapSettings = {
            layers: [mapLayer],
            attributionControl: false,
            zoomControl: false,
        };
        map = L.map('mapClass', mapSettings).setView(position, this.state.zoom);
        // map.on('click', this.onMapClick);
        console.log(map);
    },

    componentWillUnmount: function() {
        // map.off('click', this.onMapClick);
        map = null;
    },

    componentDidUpdate: function(prevProps, prevState) {
        if(this.props.upload_status == 'uploadedSuccessfully' && (prevProps.upload_status != this.props.upload_status)) {
            console.log("one does not simply load the layers correctly");
            var geojsonModelLayer = new L.GeoJSON.AJAX('/load_layers/', {
              style: myStyle,
              onEachFeature:function(feature, layer) {
                        layer.bindPopup(feature.properties.name.toString());
                    }
            });
            console.log(geojsonModelLayer)
            geojsonModelLayer.addTo(map);
            console.log('should be loaded');
        }
    },

    onMapClick: function() {
        //
    },
    onButtonClick: function() {
      console.log('clicked button');
    },


    render: function() {
        return (
            <div className="mapClass" id="mapClass">
            </div>
        )
    }
});

export default connect(selectProps)(Map);
export { Map };
