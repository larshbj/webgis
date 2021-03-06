import React from 'react';
import { connect } from 'react-redux';
import DropZoneComp from './sidebar-dropzone.jsx';
import SideBarLayer from './sidebar-layer.jsx';
import selectProps from './sidebar-select-props.js';
import * as Constants from '../constants';
import * as sidebarActions from './sidebar-actions';
import * as layerFunctions from './layer-functions';
var _ = require('lodash');
import bufferIcon from '../../../media/glyphicons-103-bold.png';
import unionIcon from '../../../media/glyphicons-191-plus-sign.png';
import interceptionIcon from '../../../media/glyphicons-596-paired.png'
import differenceIcon from '../../../media/glyphicons-192-minus-sign.png';
import userProfileSrc from '../../../media/glyphicons-4-user.png';
import Modal from 'react-awesome-modal';
import AlertContainer from 'react-alert';
import nodePath from 'path';

// var ModalClass = React.createClass({
//   displayName: "Modal",
//
//   getInitialState: function() {
//     return ({
//       visible: false;
//     })
//   },
//
//   openModal() {
//       this.setState({
//           visible : true
//       });
//   },
//
//   closeModal() {
//       this.setState({
//           visible : false
//       });
//   },
//
//   render: function () {
//     return (
//       <Modal
//         visible={this.state.visible}
//         width="400"
//         height="300"
//         effect="fadeInUp"
//         onClickAway={() => this.closeModal()}>
//         <div className="modal">
//             <h1></h1>
//             <div></div>
//
//             <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
//         </div>
//       </Modal>)
//   }
// })
var alertOptions;

var SideBarClass = React.createClass({
    displayName: "SideBar",
    propTypes: {
        layers: React.PropTypes.array.isRequired,
        incoming_upload: React.PropTypes.bool.isRequired,
        active_layers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    componentDidMount: function() {
        sidebarActions.sendStartLoadCategories();
    },

    componentDidUpdate: function(prevProps, prevState) {
        console.log("active layers: " + this.props.active_layers.length);
        if(this.props.incoming_upload && (prevProps.incoming_upload != this.props.incoming_upload)) {
            sidebarActions.sendStopLoadCategories();
            this.getCategories('/get_categories/');
        }
    },

    getCategories: function(url) {
        // sidebarActions.sendStartSpinner();
        return $.getJSON(url, {
        }).done(function(data) {
            if(typeof data === 'undefined') {
              sidebarActions.sendStopSpinner();
              msg.info('Drop a .zip-file in the drop zone to upload');
            } else {
              msg.success('Layers are loading');
              sidebarActions.sendLoadCategories(data);
            }
        });
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

    createBuffer: function() {
        let act_layers = this.props.active_layers;
        if(_.isEmpty(act_layers)) {
            msg.error('Please select a layer');
        } else if(act_layers.length > 1) {
            msg.error('Please select one layers only');
        } else {
          layerFunctions.createBuffer(act_layers);
        }
    },

    createUnion: function() {
        let act_layers = this.props.active_layers;
        if(_.isEmpty(act_layers)) {
            msg.error('No layers selected');
        } else if (act_layers.length == 1) {
            msg.error('Please select two layers');
        } else if (act_layers.length > 2) {
            msg.error('Please select two layers only');
        } else {
          layerFunctions.createUnion(act_layers);
        }
    },

    createIntersection: function() {
      let act_layers = this.props.active_layers;
      if(_.isEmpty(act_layers)) {
          msg.error('No layers selected');
      } else if (act_layers.length == 1) {
          msg.error('Please select two layers');
      } else if (act_layers.length > 2) {
          msg.error('Please select two layers only');
      } else {
        layerFunctions.createIntersection(act_layers);
      }
    },

    createDifference: function() {
      let act_layers = this.props.active_layers;
      if(_.isEmpty(act_layers)) {
          msg.error('No layers selected');
      } else if (act_layers.length == 1) {
          msg.error('Please select two layers');
      } else if (act_layers.length > 2) {
          msg.error('Please select two layers only');
      } else {
        layerFunctions.createDifference(act_layers);
      }
    },

    doGisOperation: function(operation) {
        switch(operation) {
            case 'Buffer':
                sidebarActions.sendStartSpinner();
                this.createBuffer();
                return;
            case 'Union':
                sidebarActions.sendStartSpinner();
                this.createUnion();
                return;
            case 'Intersect':
                msg.info('Unfortunately, this operation is deactivated for the time being.');
                // this.createIntersection();
                return;
            case 'Difference':
                msg.info('Unfortunately, this operation is deactivated for the time being.');
                // this.createDifference();
                return;
        }
    },

    getGlyphIcon: function(operation) {
      switch(operation) {
          case 'Buffer':
                return bufferIcon;
          case 'Union':
                return unionIcon;
          case 'Intersect':
                return interceptionIcon;
          case 'Difference':
                return differenceIcon;
      }
    },


    getInitialState: function() {
      return ({
        visible: false
      })
    },


    closeModal() {
        this.setState({
            visible : false
        });
    },

    openUserModal: function() {
      this.setState({
          visible : true
      });
    },

    goToSignOut: function() {
      // window.open("" + window.location.pathname + "/accounts/logout");
      // let path = nodePath.
      window.location.href='/accounts/logout';
    },

    alertOptions: {
        offset: 14,
        position: 'bottom left',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    },

    render: function() {
        let gisOperations = ['Buffer', 'Union', 'Difference', 'Intersect'];
        return (
          <section>
            <div className="sidebar" id="sidebar">
                <div className="headerContainer">
                  <div className="headerText" id="headerText">ReactiveGIS</div>
                  <div className="userProfileButton" onClick={() => {this.openUserModal()}}>
                    <img className="userProfile-image" src={userProfileSrc}></img>
                  </div>
                </div>
                <div className="sidebarLayersContainer">
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
                <div className="gisOperationsContainer">
                    {gisOperations.map(function(operation) {
                        let name = ["gis", operation].join(" ");
                        return (
                            <div key={operation} className={name} onClick={() => {this.doGisOperation(operation)}}>
                                <img className='gis-image' src={this.getGlyphIcon(operation)}></img>
                                <span className="tooltip">{operation}</span>
                            </div>
                      );
                    }, this)}
                </div>
                <DropZoneComp
                    {...this.props}/>
            </div>
            <Modal
              visible={this.state.visible}
              width="400"
              height="300"
              effect="fadeInUp"
              onClickAway={() => this.closeModal()}>
              <div>
                  <h1>Your profile</h1>
                  <button className="signOut" onClick={() => {this.goToSignOut()}}>Sign out</button>
                  <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
              </div>
            </Modal>
            <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
          </section>
        );
    }
});

export default connect(selectProps)(SideBarClass);
export { SideBarClass };
