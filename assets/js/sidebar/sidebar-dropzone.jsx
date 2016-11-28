var React = require('react');
import DropzoneComponent from 'react-dropzone-component';
import Cookies from 'js-cookie';
require('../../sass/sidebar.scss');
require('dropzone/dist/min/dropzone.min.css');

var csrftoken = Cookies.get('csrftoken');

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

    }

    beforeSend(file, xhr, formData) {
        // if (!this.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        // }
    }


    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
          addedfile: this.handleFileAdded.bind(this),
          success: this.uploadedFileSuccessfully.bind(this),
          sending: this.beforeSend.bind(this)
        }
        return (
          <div className="dropzoneClass">
            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
        </div>
    );
    }
}
