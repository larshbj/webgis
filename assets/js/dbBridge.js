import Cookies from 'js-cookie';

var csrftoken = Cookies.get('csrftoken');

// $(function() {

var dbBridge = {

    csrftoken: Cookies.get('csrftoken'),

    /*
     The functions below will create a header with csrftoken
     */

    csrfSafeMethod: function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    },


    sameOrigin: function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    },

    init: function() {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!this.csrfSafeMethod(settings.type) && this.sameOrigin(settings.url)) {
                    // Send the token to same-origin, relative URLs only.
                    // Send the token only if the method warrants CSRF protection
                    // Using the CSRFToken value acquired earlier
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }.bind(this)
        });
    }



}

export {dbBridge};
