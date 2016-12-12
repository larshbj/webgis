import { combineReducers } from 'redux';
import mapReducer from "./map/map-reducer";
import sidebarReducer from "./sidebar/sidebar-reducer";

export default combineReducers({
    map: mapReducer,
    sidebar: sidebarReducer
});