import React from 'react';
import L from 'leaflet';
import selectProps from './map-select-props.js';
import { connect } from 'react-redux';
import Spinner from '../spinner.jsx';
import Store from '../store.js'
require('leaflet-ajax')
require('leaflet-spin')
require('../../sass/map.scss');
require('leaflet/dist/leaflet.css');
require('jquery');
const path = require('path');
// const EventEmitter = require('events');
// const sideBarDropZone = require('./sidebar/sidebar-dropzone');

var myStyle = {
    "weight": 1,
    "opacity": 1,
};

var map;
let myLayer;
var basepath = path.dirname(path.dirname(path.dirname(document.currentScript.src)));


var Map = React.createClass({
    propTypes: {
        upload_status: React.PropTypes.string.isRequired,
        latestGeoJsonURL: React.PropTypes.string.isRequired,
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
        if(this.props.upload_status == 'uploadedSuccessfully' && (prevProps.upload_status != this.props.upload_status)) {
            console.log("one does not simply load the layers correctly");
            // this.loadGeoJSONFeature(this.props.latestGeoJsonURL);
            this.getLayers(this.props.latestGeoJsonURL);
        }
    },

    loadGeoJSONFeature: function(url) {
      var geojsonModelLayer = new L.GeoJSON.AJAX(url, {
        style: myStyle,
        onEachFeature:function(feature, layer) {
                  layer.bindPopup(feature.properties.name.toString());
        },
        pointToLayer: function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
                "radius": 3,
            });
        },
      });
      console.log("waiting");
      geojsonModelLayer.addTo(map);
      // geojsonModelLayer.on('dataLoadComplete', function(e){
      //     console.log('datacomplete');
      //     geojsonModelLayer.addTo(map);
      //     console.log(geojsonModelLayer)
      //     console.log('should be loaded');
      // })
    },

    getLayers: function(url) {
        return $.getJSON(url, {
        }).done(function(data) {
            console.log(data);
            var all_layers = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                          layer.bindPopup(feature.properties.name.toString());
                },
                style: myStyle,
                pointToLayer: function pointToLayer(feature, latlng) {
                    return L.circleMarker(latlng, {
                        "radius": 3,
                    });
                },
            });
            console.log("waiting");
            all_layers.addTo(map);
            Store.dispatch({
              type: "START_STOP_LOAD_MAP"
            });
            // var match = all_layers.eachLayer(function(layer) {
            //     layer_id = layer.feature.id + "-" + layer.feature.properties.model;
            //     layer.feature.properties.layer_id = layer_id,
            //     leaflet_id_mapping[layer_id] = layer._leaflet_id;
            // });
        });
    },

    onMapClick: function() {
      //
    },
    onButtonClick: function(event) {
      console.log('clicked button');
      this.getLayers(this.props.latestGeoJsonURL);
    },


    render: function() {
        return (
          <div>
            <div className="mapClass" id="mapClass">
            </div>
            <Spinner
              status={this.props.is_loading_to_map} />
            <div className="testButton"
              onClick={this.onButtonClick.bind(this)}>
            </div>
          </div>
        )
    }
});

export default connect(selectProps)(Map);
export { Map };
