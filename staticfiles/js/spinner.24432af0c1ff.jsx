import React from 'react';
import Spinner from 'react-spin';

const MySpinner = React.createClass({
  propTypes: {
    status: React.PropTypes.bool.isRequired,
  },
  render: function() {
    var spinCfg = {
      width: 12,
      radius: 20,
      // ...
    };
    return <Spinner config={spinCfg} stopped={!this.props.status} />
  }
});

export default MySpinner
