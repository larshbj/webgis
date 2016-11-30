import React from 'react';


export default React.createClass({
    displayName: "SidebarLayer",
    propTypes: {
        layer: React.PropTypes.string.isRequired,
        isActive: React.PropTypes.bool.isRequired,
        bufferActive: React.PropTypes.bool.isRequired
    },

    getClassName: function(layer) {
        let active = this.props.active ? 'active':'';
        return ["sidebar-layer ", layer, active].join(" ");
    },

    handleItemClick: function(layer, event) {
        //TODO: add funcionality
    },


    render: function() {
        return (
          <div className={this.getClassName(this.props.layer)}
              onClick={this.handleLayerClick.bind(this, this.props.layer)}
              onTouchEnd={this.handleLayerClick.bind(this, this.props.layer)}>

          </div>

        );
    }
});
