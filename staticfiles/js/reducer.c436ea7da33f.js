import { combineReducers } from 'redux';
import mapReducer from "./map/map-reducer";
import sidebarReducer from "./sidebar/sidebar-reducer";
import {routerReducer} from 'react-router-redux';

export default combineReducers({
    map: mapReducer,
    sidebar: sidebarReducer,
    routing: routerReducer
});
