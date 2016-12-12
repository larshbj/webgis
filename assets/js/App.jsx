import React from 'react';
import SideBarClass from './sidebar/sidebar.jsx';
import Map from './map/Map.jsx';

const App = React.createClass({
    render: function() {
        return (
            <div>
                <SideBarClass
                    {...this.props}/>
                <Map
                    {...this.props}/>
            </div>

        )
    }
});

export default App;
