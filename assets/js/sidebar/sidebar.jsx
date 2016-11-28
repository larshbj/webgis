import React from 'react';
import DropZoneComp from './sidebar-dropzone.jsx';
require('../../sass/sidebar.scss');

var SideBar = React.createClass({

    getScreenProps: function() {
    },

    render: function() {
        return (
            <div className="sidebar" id="sidebar" onTouchEnd={this.getScreenProps()}>
                <DropZoneComp />
            </div>

        );
    }
});

export default SideBar;
