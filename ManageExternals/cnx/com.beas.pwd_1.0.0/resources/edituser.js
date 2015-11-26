define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dijit/Dialog',
        'dojo/text!./templates/edituser.html',
        'dojo/i18n!./nls/edituserStrings',
        './config',
        'dijit/form/TextBox',
        'com/ibm/social/incontext/util/proxy'
        ], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog, template, nls, config) {
	return declare("com.beas.pwd.edituser", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog], {
		version: '201508141800',
		templateString: template,
		nls: nls,
		config: config,
		caption: lconn.core.auth.getUser().displayName,
		util: com.ibm.social.incontext.util,
		blankIcon: "",
		parentWidget: null,
		postMixInProperties: function() {
			this.caption = dojo.string.substitute(this.nls.caption.label, [lconn.core.auth.getUser().displayName]);
			this.inherited(arguments);
			this.blankIcon = this._blankGif;
		},
		showDialog: function(uid, parentWidget) {
			this.parentWidget = parentWidget;
			this.show();
			this.myListUser(uid);
			dojo.setStyle(this.domNode,"top","75px");
		},
		editUser: function() {
			var formObject = dojo.formToObject(this.id + "_form");

			if (formObject.name1.length > 0 && formObject.name2.length > 0 && formObject.email1.length > 0 && formObject.company1.length > 0) {
				if (this.isEmail(formObject.email1)){
					this.myEditUser(formObject.name1, formObject.name2, formObject.email1, formObject.company1, formObject.docunid);
				} else {
					this.writeMessage("error", this.nls.messages.invalidemail);
				}
			} else {
				this.writeMessage("error", this.nls.messages.empty);
			}

		},
		cancelDialog: function() {
			this.writeMessage("","");
			dojo.byId(this.id + "_name1").value="";
			dojo.byId(this.id + "_name2").value="";
			dojo.byId(this.id + "_email1").value="";
			dojo.byId(this.id + "_company1").value="";
			dojo.byId(this.id + "_docunid").value="";
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
		myEditUser: function(firstname, lastname, email, company, docunid) {
			var thisWidget = this;
			if (com.beas.pwd.config && com.beas.pwd.config.url && com.beas.pwd.config.url.length > 0 ) {
				var url = com.ibm.social.incontext.util.proxy(com.beas.pwd.config.url + "/edituser");
				var xhrArgs = {
						url: url,
						postData: "firstname=" + encodeURIComponent(firstname) + "&lastname=" + encodeURIComponent(lastname) + "&email=" + encodeURIComponent(email)+ "&company=" + encodeURIComponent(company) + "&docunid="+encodeURIComponent(docunid),
						handleAs: "json",
						load: function(data){
							//console.log("xhrPost Data: ", data);

							var severity = "error";

							if (data.errorNumber == 0) {
								severity = "success";
								thisWidget.parentWidget.refreshGrid();
								thisWidget.writeMessage(severity,thisWidget.nls.messages.success);
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
				//console.log("ERROR: " + this.nls.messages.unconfigured);
				thisWidget.writeMessage("error",this.nls.messages.unconfigured);
			}
		},
		myListUser: function(uid) {
			var thisWidget = this;
			if (com.beas.pwd.config && com.beas.pwd.config.url && com.beas.pwd.config.url.length > 0 ) {
				var url = com.ibm.social.incontext.util.proxy(com.beas.pwd.config.url + "/getuserbyuid?OpenAgent&docunid="+ uid);
				var xhrArgs = {
						url: url,
						handleAs: "json",
						load: function(data){
							var severity = "error";

							if (data.errorNumber == 0) {
								dojo.byId(thisWidget.id + "_name1").value=data.FirstName;
								dojo.byId(thisWidget.id + "_name2").value=data.LastName;
								dojo.byId(thisWidget.id + "_email1").value=data.Mail;
								dojo.byId(thisWidget.id + "_company1").value=data.Company;
								dojo.byId(thisWidget.id + "_docunid").value=data.DocUNID;
							} else {
								thisWidget.writeMessage(severity,thisWidget.localMessage(data.errorNumber, data.errorString));
							}
						},
						error: function(error){
							thisWidget.writeMessage("error",error.message);
						}
				}
				// Call the asynchronous xhrPost
				var deferred = dojo.xhrGet(xhrArgs);
			} else {
				thisWidget.writeMessage("error",this.nls.messages.unconfigured);
			}
		},
		isEmail: function(email){
			var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			return emailReg.test(email);
		}
	});
});
