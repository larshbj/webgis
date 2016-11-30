import React from 'react';
import SideBar from './sidebar/sidebar.jsx';
import Map from './map/Map.jsx';

const App = React.createClass({
    render: function() {
        return (
            <div>
                <SideBar />
                <Map
                    {...this.props}/>
            </div>

        )
    }
});

export default App;
