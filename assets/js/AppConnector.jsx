import App from './App.jsx';
import selectFromStateProps from './select-props.js';
import { connect } from 'react-redux';

export default connect(selectFromStateProps)(App);