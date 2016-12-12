import React from 'react';
import * as Actions from './sidebar-actions';
import L from 'leaflet';
import * as Constants from '../constants';
const _ = require('lodash');
import * as layerFunctions from './layer-functions.js';
import * as sidebarActions from './sidebar-actions';

export default React.createClass({
    displayName: "SidebarLayer",
    propTypes: {
        layerName: React.PropTypes.string.isRequired,
        // layerData: React.PropTypes.object.isRequired,
        color: React.PropTypes.string.isRequired,
        // bufferActive: React.PropTypes.bool.isRequired
    },
    dataLayer: {},

    getInitialState: function() {
        return {
            layerData: {},
            active: false,
            hidden: false
        };
    },

    componentDidMount: function() {
        this.getLayer();
    },

    getLayer: function() {
        var url = 'getCategoryLayer/'.concat(this.props.layerName);
        this.getCategoryLayer(url);
    },

    getCategoryLayer: function(url) {
        return $.getJSON(url, {
        }).done(function(data) {
                this.dataLayer = L.geoJson(data, {
                    onEachFeature: this.onEachFeature,
                    style: this.getFeatureStyle,
                    pointToLayer: this.pointToLayer
                });
                this.setState({
                    layerData: this.dataLayer
                });
                console.log(this.dataLayer._leaflet_id);
                Actions.addLayerToMap(this);
                layerFunctions.saveFeatureColors(this.dataLayer);
        }.bind(this));
    },

    componentDidUpdate: function(prevProps, prevState) {
        // if(this.)
    },

    componentWillUnmount: function() {
        Actions.removeLayerFromMap(this);
    },

    getClassName: function(layerName, color) {
        let active = this.state.active ? 'active':'';
        return ["sidebar-layer", color, layerName, active].join(" ");
    },

    handleLayerClick: function(layer, event) {
        this.setState({
            active: (this.state.active === false ? true : false)
        });
        console.log(["Layer", layer, !this.state.active].join(" "));
        console.log(this.dataLayer);
        if(!this.state.active) {
            console.log("hei");
            layerFunctions.selectAllFeatures(this.dataLayer);
        } else {
            layerFunctions.deSelectAllFeatures(this.dataLayer);
        }
    },

    getFeatureStyle: function(feature, layer) {
        let layerColor = layerFunctions.generateRandomColor(this.props.color);
        if ((typeof feature !== 'undefined') && (typeof feature.properties !== 'undefined') && (typeof feature.properties.color !== 'undefined')) {
            layerColor = feature.properties.color
        }
        return {
            fillColor: layerColor,
            color: layerColor,
            weight: 3,
            fillOpacity: 0.7,
            opacity: 0.7
        };
    },

    // getStyle: function(feature, layer) {
    //     return layerFunctions.getFeatureStyle(feature, layer, this.props.color);
    // },

    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name.toString());

        // layer.on('click', function(e) {
        //     layerFunctions.toggleSelectFeature(e.target, dataLayer);
        //
        // }.bind(this));

        layer.on('mouseover', function(e) {
            layerFunctions.highlightFeature(e.target);
        }.bind(this));

        layer.on('mouseout', function(e) {
            layerFunctions.resetHighlightFeature(e.target, this.dataLayer);
        }.bind(this));
    },

    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            "radius": 3,
        });
    },

    createBuffer: function() {
        $.ajax({
            url: "/create_buffer/",
            type: "POST",
            data : {
                'buffer_distance': 100,
                'layer_ids': JSON.stringify(layerFunctions.getLayerIDs(this.dataLayer)),
                'category': this.props.layerName,
            },

            success: function(data) {
                var result = JSON.parse(data);
                var category = result['category'];
                var featureCollection = result['featureCollection'];
                console.log(category);
                this.getLayer();
                sidebarActions.sendAddSidebarLayer(category);
            }.bind(this),

            error: function(xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);
            }
        });
    },

    handleCheckboxClick: function() {
          this.setState({
              hidden: (this.state.hidden === false ? true : false)
          });
          if(!this.state.hidden) {
              console.log("checkbox says remove");
              sidebarActions.removeLayerFromMap(this);
          } else {
              console.log("checkbox says add");
              sidebarActions.addLayerToMap(this);
          }
    },


    render: function() {
        return (
            <span>
                <input type="checkbox"
                       className="checkboxClass"
                       defaultChecked={!this.state.hidden}
                       onClick={this.handleCheckboxClick}>
                </input>
                <div className={this.getClassName(this.props.layerName, this.props.color)}
                    onClick={this.handleLayerClick.bind(this, this.props.layerName)}
                    onTouchEnd={this.handleLayerClick.bind(this, this.props.layerName)}>
                    {this.props.layerName}
                </div>
                <div className="buffer_div"
                    onClick={this.createBuffer}>
                </div>
            </span>
        );
    }
});
