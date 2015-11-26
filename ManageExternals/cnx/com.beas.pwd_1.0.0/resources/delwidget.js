define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/Dialog',
    'dojo/text!./templates/delwidget.html',
    'dojo/i18n!./nls/pwdwidgetStrings',
    './config',
    'dijit/form/TextBox',
    'com/ibm/social/incontext/util/proxy'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog, template, nls, config) {
    return declare("com.beas.pwd.delwidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog], {
	version: '201508141800',
        templateString: template,
	nls: nls,
	config: config,
	caption: "",
	util: com.ibm.social.incontext.util,
	blankIcon: "",
	parentWidget: null,
	postMixInProperties: function() {
		this.inherited(arguments);
		this.blankIcon = this._blankGif;
	},
	showDialog: function(dominounid, username, parentWidget) {
		this.parentWidget = parentWidget;
		this.caption = dojo.string.substitute(this.nls.deleteMsg.label, [username]);
		this.show();
		var capelem = dojo.byId(this.id + "_caption");
		if (capelem) {
			capelem.innerHTML = this.caption;
		}
		var docidelem = dojo.byId(this.id + "_docunid");
		if (docidelem) {
			docidelem.innerHTML = dominounid;
		}
		dojo.setStyle(this.domNode,"top","75px");
	},
	deleteUser: function() {
		var docidelem = dojo.byId(this.id + "_docunid");
		var docunid = "";
		if (docidelem) {
			docunid = docidelem.innerHTML;
			this.postPassword(docunid);
		}
		

	},
	cancelDialog: function() {
		this.writeMessage("","");
		dojo.setStyle(this.id + "_caption",{"display":"inline"});
		dojo.byId(this.id+"_deleteBtn").disabled = false;
		dojo.byId(this.id+"_deleteBtn").className = "lotusBtn"; 
		this.onCancel();
	},
	writeMessage: function(type, message) {
		var messageContainer = dojo.byId(this.id + "_messageContainer");
		if (message && message.length > 0) {
			if (type && type.length > 0) {
				switch (type) {
					case 'error':
						dojo.setStyle(this.id + "_messageContainer",{"display":"inline","color":"red"});
						messageContainer.innerHTML = "<div class=\"lotusMessage2\" role=\"alert\" style=\"margin: 5px; top: 0px;\"> <img class=\"lotusIcon lotusIconMsgError\" src=\"" + this.blankIcon + "\" alt=\"Error\" /><span class=\"lotusAltText\">Error:</span> <div class=\"lotusMessageBody\">" + message + "</div></div>";
						break;
					case 'warning':
						dojo.setStyle(this.id + "_messageContainer",{"display":"inline","color":"orange"});
						messageContainer.innerHTML = "<div class=\"lotusMessage2 lotusWarning\" role=\"alert\" style=\"margin: 5px; top: 0px;\"> <img class=\"lotusIcon lotusIconMsgWarning\" src=\"" + this.blankIcon + "\" alt=\"Warning\" /><span class=\"lotusAltText\">Warning:</span> <div class=\"lotusMessageBody\">" + message + "</div></div>";
						break;
					case 'success':
						dojo.setStyle(this.id + "_messageContainer",{"display":"inline","color":"green"});
						messageContainer.innerHTML = "<div class=\"lotusMessage2 lotusSuccess\" role=\"alert\" style=\"margin: 5px; top: 0px;\"> <img class=\"lotusIcon lotusIconMsgSuccess\" src=\"" + this.blankIcon + "\" alt=\"Success\" /><span class=\"lotusAltText\">Success:</span> <div class=\"lotusMessageBody\">" + message + "</div></div>";
						break;
					default:
						dojo.setStyle(this.id + "_messageContainer",{"display":"inline","color":"blue"});
						messageContainer.innerHTML = "<div class=\"lotusMessage2 lotusInfo\" role=\"alert\" style=\"margin: 5px; top: 0px;\"> <img class=\"lotusIcon lotusIconMsgInfo\" src=\"" + this.blankIcon + "\" alt=\"Information\" /><span class=\"lotusAltText\">Information:</span> <div class=\"lotusMessageBody\">" + message + "</div></div>";
				}
			} else {
				dojo.setStyle(this.id + "_messageContainer",{"display":"inline","color":"blue"});
				messageContainer.innerHTML = "<div class=\"lotusMessage2 lotusInfo\" role=\"alert\" style=\"margin: 5px; top: 0px;\"> <img class=\"lotusIcon lotusIconMsgInfo\" src=\"" + this.blankIcon + "\" alt=\"Information\" /><span class=\"lotusAltText\">Information:</span> <div class=\"lotusMessageBody\">" + message + "</div></div>";
			}
		} else {
			dojo.setStyle(this.id + "_messageContainer",{"display":"none"});
			messageContainer.innerHTML = "";
		}
	},
	localMessage: function(errorNumber, errorString) {
		if (nls && nls.messages && nls.messages[errorNumber]) {
			return nls.messages[errorNumber];
		} else {
			return errorString;
		}
	},
	postPassword: function(docunid) {
		var thisWidget = this;
		if (com.beas.pwd.config && com.beas.pwd.config.url && com.beas.pwd.config.url.length > 0 ) {
			var url = com.ibm.social.incontext.util.proxy(com.beas.pwd.config.url + "/deleteaccount");

			var xhrArgs = {
				url: url,
				postData: "docunid=" + encodeURIComponent(docunid),
				handleAs: "json",
				load: function(data){
					var severity = "error";
					if (data.errorNumber == 0) {
						severity = "success";
						thisWidget.writeMessage(severity,thisWidget.nls.messages.successdel);
						thisWidget.parentWidget.refreshGrid();
						dojo.setStyle(thisWidget.id + "_caption",{"display":"none"});
						dojo.byId(thisWidget.id+"_deleteBtn").disabled = true; 
						dojo.byId(thisWidget.id+"_deleteBtn").className += " lotusBtnDisabled"; 
					} else {
						thisWidget.writeMessage(severity,thisWidget.localMessage(data.errorNumber, data.errorString));
					}
				},
				error: function(error){
					thisWidget.writeMessage("error",error.message);
				}
			}
			// Call the asynchronous xhrPost
			var deferred = dojo.xhrPost(xhrArgs);
		} else {
			thisWidget.writeMessage("error",this.nls.messages.unconfigured);
		}
	}
    });
});
