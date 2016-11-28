import React from 'react';
import L from 'leaflet';
import'../sass/map.scss';

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "line"
    },
    "geometry": {
        "type": "LineString",
        "coordinates": [[63.41, 10.4], [63.3, 10.9], [63.9, 10.3]]
    }
};

let map;
let myLayer;

var MapCanvas = React.createClass({
    displayName: "MapCanvas",
    propTypes: {

    },
    getInitialState: function() {
        return {
            lat: 63.41,
            lng: 10.4,
            zoom: 14,
        };
    },
    map: map,
    // myLayer: myLayer,

    componentDidMount: function() {
        let position = [this.state.lat, this.state.lng];
        let mapLayer = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {subdomains: "abc", maxZoom: 18});
        let mapSettings = {
            layers: [mapLayer],
            attributionControl: false,
            zoomControl: false,
        };
        this.map = L.map('map', mapSettings).setView(position, this.state.zoom);
        this.map.on('click', this.onMapClick);
        // myLayer = L.geoJSON().addTo(this.map);
        // myLayer.addData(geojsonFeature);

        // let map = L.map('map', {
        //     center: [this.state.lat, this.state.lng],
        //     zoom: this.state.zoom,
        //     layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        //
        //
        // var geojsonWorldBorderLayer = new L.GeoJSON.AJAX("{% url 'worldborders' %}");
        // geojsonWorldBorderLayer.addTo(map);
    },

    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },

    onMapClick: function() {
        //
    },
    onButtonClick: function() {
        L.geoJSON(geojsonFeature2, {
            style: myStyle
        }).addTo(this.map);
        console.log(this.map);
        // console.log(this.myLayer);
        // this.myLayer.addData(geojsonFeature2);
    },

    render: function() {
        return (
            <div className = "map" id="map">
                <div className="button1" id="button1" onClick={this.onButtonClick}></div>
            </div>
        )
    }
});

export default MapCanvas;
