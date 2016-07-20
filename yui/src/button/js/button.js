// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_panoptobutton
 * @copyright  COPYRIGHTINFO
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_panoptobutton-button
 */

/**
 * Atto text editor panoptobutton plugin.
 *
 * @namespace M.atto_panoptobutton
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_panoptobutton';
var LOGNAME = 'atto_panoptobutton';
var servername = '';
var courseid = '';
var idstring = '';
var IFSOURCE = servername + '/Panopto/Pages/Sessions/EmbeddedUpload.aspx';
var IFHEIGHT = 550;
var IFWIDTH = 1060;
var IFID = 'pageframe';
var SUBMITID = 'submit';
var SELECTALIGN = 'float:left; display:none';


var CSS = {
    INPUTSUBMIT: 'atto_media_urlentrysubmit',
};

var TEMPLATE = '' +
    '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
    '<iframe src="{{isource}}" id="{{iframeID}}" height="{{iframeheight}}" width="{{iframewidth}}" scrolling="auto"></iframe>' +
        '<br><br>' +
    '</div>' +
    '<button class="{{CSS.INPUTSUBMIT}}" id="{{submitid}}" style="{{selectalign}}">{{get_string "insert" component}}</button>';

Y.namespace('M.atto_panoptobutton').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function () {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')) {
            return;
        }

        //Get the external id of the course, and if it exists, append to the url for the iframe
        courseid = this.get('coursecontext');

        if (courseid) {
            idstring = '?folderId=' + courseid;
        }

        //set name of button icon to be loaded
        var icon = 'iconone';

        // Add the panoptobutton icon/buttons
        this.addButton({
            icon: 'ed/' + icon,
            iconComponent: 'atto_panoptobutton',
            buttonName: icon,
            callback: this._displayDialogue,
            callbackArgs: icon
        });
    },

    /**
    * Display the panoptobutton Dialogue
    *
    * @method _displayDialogue
    * @private
    */
    _displayDialogue: function (e, clickedicon) {
        e.preventDefault();
        var width = 1150;
        var height = 720;

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            height: height + 'px',
            focusAfterHide: clickedicon

        });

        //When dialog becomes invisible, reset it. This fixes problems with multiple editors per page.
        dialogue.after("visibleChange", function(){
           var attributes = dialogue.getAttrs();
           if(attributes['visible'] == false)
           {
              setTimeout(function(){
                 dialogue.reset();
              }, 5);
           }
        });

        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if (dialogue.width !== width + 'px') {
            dialogue.set('width', width + 'px');
        }

        if (dialogue.height !== height + 'px') {
            dialogue.set('height', height + 'px');
        }
        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon);

        var bodycontent = Y.Node.create('<div></div>');
        bodycontent.append(buttonform);


        var defaultserver = this.get('defaultserver');

        //Setup for message handling from iframe
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventEnter = window[eventMethod];
        var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

        eventEnter(messageEvent, function (e) {
            var message = JSON.parse(e.data);

            if (message.cmd === 'ready') {
                document.getElementById("submit").style.display = 'block';
            }

            //If no video is chosen, hide the "Insert" button
            if (message.cmd === 'notReady') {
                document.getElementById("submit").style.display = 'none';
            }
        }, false);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        var aservername = this.get('servename');
        if (aservername) {
            document.getElementById('pageframe').src = 'https://' + aservername + '/Panopto/Pages/Sessions/EmbeddedUpload.aspx' + idstring;
            servername = aservername;
        }
        else {
            document.getElementById('pageframe').src = 'https://' + defaultserver + '/Panopto/Pages/Sessions/EmbeddedUpload.aspx' +idstring;
            servername = defaultserver;
        }

        dialogue.show();

        this.markUpdated();
    },

    /**
    * Return the dialogue content for the tool, attaching any required
    * events.
    *
    * @method _getDialogueContent
    * @return {Node} The content to place in the dialogue.
    * @private
    */
    _getFormContent: function (clickedicon) {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                component: COMPONENTNAME,
                clickedicon: clickedicon,
                isource: IFSOURCE + idstring,
                iframeheight: IFHEIGHT,
                iframeID: IFID,
                submitid: SUBMITID,
                iframewidth: IFWIDTH,
                selectalign: SELECTALIGN
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert: function (e) {
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var win = document.getElementById("pageframe").contentWindow,
        message = { cmd: "createEmbeddedFrame" };
        win.postMessage(JSON.stringify(message), 'https://' + servername);

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventEnter = window[eventMethod];
        var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

        var parent = this;

        //Event triggered when response is received from server with object ids
        eventEnter(messageEvent, function (e) {
            var message = JSON.parse(e.data);
            var objectstring = "";

            //Called when "Insert" is clicked. Creates HTML for embedding each selected video into the editor
            if (message.cmd === 'deliveryList') {
                ids = message.ids;

                for (var value in ids) {
                    objectstring += "<object type='text/html' data='https://" + servername + "/Panopto/Pages/Embed.aspx?id=" + ids[value] + "&v=1' width='450' height='300' frameborder='0'><br>";
                }

                parent.editor.focus();
                parent.get('host').insertContentAtFocusPoint(objectstring);
                parent.markUpdated();
            }
        }, false);
    }
}, {
    ATTRS: {
        disabled: {
            value: false
        },

        usercontextid: {
            value: null
        },

        defaultserver: {
            value: ''
        },
        coursecontext: {
            value: null
        },
        servename: {
            value: null
        }
    }
});
