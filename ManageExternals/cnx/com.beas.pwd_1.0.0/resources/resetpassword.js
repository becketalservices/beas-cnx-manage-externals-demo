define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dijit/Dialog',
        'dojo/text!./templates/resetpassword.html',
        'dojo/i18n!./nls/pwdwidgetStrings',
        './config',
        'dijit/form/TextBox',
        'com/ibm/social/incontext/util/proxy'
        ], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog, template, nls, config) {
	return declare("com.beas.pwd.resetpassword", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog], {
		version: '201508141700',
		templateString: template,
		nls: nls,
		config: config,
		resetMsg: lconn.core.auth.getUser().displayName,
		util: com.ibm.social.incontext.util,
		blankIcon: "",
		postMixInProperties: function() {
			this.inherited(arguments);
			this.blankIcon = this._blankGif;
		},
		showDialog: function(docunid,name) {
			//hide all messages again
			/* disabled in version 1.0
		document.getElementById(this.id + "_sendemail").checked = true;
			 */
			this.hidePassword();
			//show info line
			var infoContainer = dojo.byId(this.id + "_infoContainer");
			// resetInfoMsg
			infoContainer.innerHTML = "<p>" + dojo.string.substitute(this.nls.resetInfoMsg, [name]); + "<\p>";
			//add docunid to DOM
			var docunidContainer = dojo.byId(this.id + "_docunidContainer");
			docunidContainer.value = docunid;
			//show dialog and set style
			this.show();
			dojo.setStyle(this.domNode,"top","75px");
		},
		resetPassword: function() {
			var formObject = dojo.formToObject(this.id + "_form");

			if (formObject.sendOrShowPwd == "sendemail") {
				this.hidePassword();
				this.postPassword(formObject.docunid,true);
			} else {
				this.hidePassword();
				this.postPassword(formObject.docunid,false);
			}
		},
		cancelDialog: function() {
			this.writeMessage("","");
			this.hidePassword();
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
		displayPassword: function(password) {
			var passwordContainer = dojo.byId(this.id + "_passwordContainer");
			if (password && password.length > 0) {
				dojo.setStyle(this.id + "_passwordContainer",{"display":"inline"});
				// resetNewPwdMsg
				passwordContainer.innerHTML = "<table><tr><td style=\"padding-right: 5px; padding-left:22px;\">" + this.nls.resetNewPwdMsg + "</td><td style=\"border: 1px solid black; background-color: #F0F0F0; padding: 10px; font-size:1.4em; font-family: Monospace; font-weight: bold; letter-spacing:0.1em;\">" + password + "</td></tr></table>";
			} else {
				dojo.setStyle(this.id + "_passwordContainer",{"display":"none"});
				passwordContainer.innerHTML = "";
			}
		},
		hidePassword: function() {
			var passwordContainer = dojo.byId(this.id + "_passwordContainer");
			dojo.setStyle(this.id + "_passwordContainer",{"display":"none"});
			passwordContainer.innerHTML = "";
		},
		postPassword: function(docunid, sendMail) {
			var thisWidget = this;
			if (com.beas.pwd.config && com.beas.pwd.config.url && com.beas.pwd.config.url.length > 0 ) {
				var url = com.ibm.social.incontext.util.proxy(com.beas.pwd.config.url + "/resetPwdExternal");

				var xhrArgs = {
						url: url,
						postData: "docunid=" + encodeURIComponent(docunid) + "&sendMail=" + encodeURIComponent(sendMail),
						handleAs: "json",
						load: function(data){
							var severity = "error";
							if (data.errorNumber == 0) {
								severity = "success";
								thisWidget.writeMessage(severity,thisWidget.nls.messages.success);
								if (data.password) {
									dojo.hitch(thisWidget, thisWidget.displayPassword(data.password));
								}
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
