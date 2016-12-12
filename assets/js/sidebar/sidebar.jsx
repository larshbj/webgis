import React from 'react';
import { connect } from 'react-redux';
require('../../sass/sidebar.scss');
import DropZoneComp from './sidebar-dropzone.jsx';
import SideBarLayer from './sidebar-layer.jsx';
import selectProps from './sidebar-select-props.js';
import * as Constants from '../constants';
import * as sidebarActions from './sidebar-actions';
import * as layerFunctions from './layer-functions';

var SideBarClass = React.createClass({
    displayName: "SideBar",
    propTypes: {
        layers: React.PropTypes.array.isRequired,
        incoming_upload: React.PropTypes.bool.isRequired
    },

    componentDidUpdate: function(prevProps, prevState) {
        if(this.props.incoming_upload && (prevProps.incoming_upload != this.props.incoming_upload)) {
            sidebarActions.sendStopLoadCategories();
            this.getCategories('/get_categories/');
        }
    },

    getCategories: function(url) {
        return $.getJSON(url, {
        }).done(function(data) {
            sidebarActions.sendLoadCategories(data);
        });
    },

    tempFunction: function() {
        console.log(this.props.layers);
        this.forceUpdate();
        sidebarActions.sendStartLoadCategories();
    },

    generateBaseColor: function(layerName) {
        let colors = Constants.colors;
        let index = this.props.layers.indexOf(layerName);
        if(index < colors.length) {
            return colors[index];
        } else {
            return colors[Math.floor(Math.random()*colors.length)];
        }
    },

    // createBuffer: function(layer) {
    //     $.ajax({
    //         url: "/create_buffer/",
    //         type: "POST",
    //         data : {
    //             'buffer_distance': 100,
    //             'layer_ids': JSON.stringify(layerFunctions.getLayerIDs(layer)),
    //             'category': layer,
    //         },
    //
    //         success: function() {
    //             // sidebarActions.sendAddSidebarLayer()
    //             this.getCategories('/get_categories/');
    //         }.bind(this),
    //
    //         error: function(xhr, ajaxOptions, thrownError) {
    //             console.log(xhr.status);
    //             console.log(xhr.responseText);
    //             console.log(thrownError);
    //         }
    //     });
    // },

    render: function() {
        return (
            <div className="sidebar" id="sidebar">
                <div className="headerText" onClick={this.tempFunction} id="headerText">ReactiveGIS</div>
                <DropZoneComp
                    {...this.props}/>

                {this.props.layers.map(function(layer) {
                    var layerColor = this.generateBaseColor(layer);
                    return (
                        <SideBarLayer
                            {...this.props}
                            key={layer}
                            layerName={layer}
                            color={layerColor}
                        />);
                }, this )}
            </div>
        );
    }
});

export default connect(selectProps)(SideBarClass);
export { SideBarClass };
