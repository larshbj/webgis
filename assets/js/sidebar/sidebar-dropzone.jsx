var React = require('react');
import DropzoneComponent from 'react-dropzone-component';
import Cookies from 'js-cookie';
import L from 'leaflet'
import Store from '../store.js';
require('../../sass/sidebar.scss');
require('dropzone/dist/min/dropzone.min.css');

// var EventEmitter = require('events');
// var events = require('../events.js')
require('leaflet-ajax')
const Map = require('../map/Map.jsx');

// var emitter = new EventEmitter();
var csrftoken = Cookies.get('csrftoken');

// emitter.once('newListener', (event, listener) => {
//   if (event === 'event') {
//     // Insert a new listener in front
//     emitter.on('event', () => {
//
//     });
//   }
// });

export default class SideBarDropZone extends React.Component {
    constructor(props) {
        super(props);

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            autoProcessQueue: true,
            acceptedFiles: ".shp, .zip, .shx, .prj, .dbf"
        };

        this.componentConfig = {
            iconFiletypes: ['.shp', '.zip'],
            showFiletypeIcon: true,
            postUrl: 'uploadHandler/'
        };
    }

    csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    handleFileAdded(file) {
        console.log(file);
    }

    uploadedFileSuccessfully(file, response) {
        console.log('success');
        // emitter.emit('UPLOAD_SUCCESSFULL', geojsonModelLayer);
        Store.dispatch({
            type: 'UPLOAD_SUCCESSFUL'
        });
    }

    beforeSend(file, xhr, formData) {
        // if (!this.csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        // }
        Store.dispatch({
            type: "FILE_UPLOADING"
        });
    }

    whenComplete(file) {
        // $.ajax({
        //   type: 'POST',
        //   url: '/upload_completed/',
        //   data: {},
        //   success: function(data) {
        //     console.log("Got response from server...");
        //   }
        // });
        // emitter.emit('UPLOAD_COMPLETED');

    }


    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
          addedfile: this.handleFileAdded.bind(this),
          success: this.uploadedFileSuccessfully.bind(this),
          sending: this.beforeSend.bind(this),
          complete: this.whenComplete.bind(this)
        };
        return (
          <div className="dropzoneClass">
            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
        </div>
    );
    }
}
