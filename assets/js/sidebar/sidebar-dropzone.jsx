var React = require('react');
import DropzoneComponent from 'react-dropzone-component';
import Cookies from 'js-cookie';
import * as sidebarActions from './sidebar-actions.js';
require('dropzone/dist/min/dropzone.min.css');
require('leaflet-ajax')
const Map = require('../map/Map.jsx');
var csrftoken = Cookies.get('csrftoken');

export default class SideBarDropZone extends React.Component {
    constructor(props) {
        super(props);

        this.djsConfig = {
            autoProcessQueue: true,
            acceptedFiles: ".shp, .zip, .shx, .prj, .dbf, .cpg"
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
        // sidebarActions.sendStartSpinner();
    }

    uploadedFileSuccessfully(file, response) {
        console.log('success');
        sidebarActions.sendFileIsFinished();
        sidebarActions.sendStartLoadCategories();
    }

    beforeSend(file, xhr, formData) {
        // if (!this.csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        // }
        sidebarActions.sendFileIsUploading();
    }

    uploadNotSuccessful() {
        console.log("upload unsuccesful");
        sidebarActions.sendFileIsFinished();
        // sidebarActions.sendStopSpinner();
    }



    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            addedfile: this.handleFileAdded.bind(this),
            success: this.uploadedFileSuccessfully.bind(this),
            sending: this.beforeSend.bind(this),
            canceled: this.uploadNotSuccessful.bind(this),
            error: this.uploadNotSuccessful.bind(this),
        };
        return (
          <div className="dropZoneContainer">
            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
        </div>
    );
    }
}
