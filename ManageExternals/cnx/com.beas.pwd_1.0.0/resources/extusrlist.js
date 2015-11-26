define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dijit/Dialog',
        'dojo/text!./templates/extusrlist.html',
        'dojo/i18n!./nls/pwdwidgetStrings',
        './config',
        'dojox/grid/EnhancedGrid',
        'dojox/grid/enhanced/plugins/Pagination',
        'com/beas/pwd/ModJsonRest',
        'dojo/data/ObjectStore',
        'com/beas/pwd/delwidget',
        'com/beas/pwd/helpwidget',
        'com/beas/pwd/resetpassword',
        'com/beas/pwd/registeruser',
        'com/beas/pwd/edituser',
        'dijit/Toolbar',
        'dijit/form/Button',
        'dijit/form/TextBox',
        'com/ibm/social/incontext/util/proxy'
        ], function (declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog, template, nls, config, EnhancedGrid, Pagination, JsonRest, ObjectStore, delwidget, helpwidget, resetpassword, registeruser, edituser, Toolbar, Button) {
	return declare("com.beas.pwd.extusrlist", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog], {
		version: '201507291800-draft',
		templateString: template,
		nls: nls,
		config: config,
		caption: lconn.core.auth.getUser().displayName,
		util: com.ibm.social.incontext.util,
		blankIcon: "",
		grid: null,
		globalNS: "",
		isClosed: false,
		constructor: function(globalNS) {
			this.globalNS = globalNS;
		},
		resetPW: function(docunid, name) {
			var pwd = com.beas.pwd;
			if (!pwd.dialogreset) {
				pwd.dialogreset = new resetpassword();
			}
			pwd.dialogreset.showDialog(docunid,name);
		},
		createUSR: function() {
			var pwd = com.beas.pwd;
			if (!pwd.registerdialog) {
				pwd.registerdialog = new registeruser();
			}
			pwd.registerdialog.showDialog(this);
		},
		editUSR: function(docunid,name) {
			var pwd = com.beas.pwd;
			if (!pwd.editdialog) {
				pwd.editdialog = new edituser();
			}
			pwd.editdialog.showDialog(docunid,this);
		},
		deleteUSR: function(docunid,name) {
			var pwd = com.beas.pwd;
			if (!pwd.dialogdel) {
				pwd.dialogdel = new delwidget();
			}
			pwd.dialogdel.showDialog(docunid,name,this);
		},
		showHelp: function() {
			var pwd = com.beas.pwd;
			if (!pwd.dialoghelp) {
				pwd.dialoghelp = new com.beas.pwd.helpwidget();
			}
			pwd.dialoghelp.showDialog();
		},
		postMixInProperties: function() {
			this.inherited(arguments);
			var thisWidget = this;
			this.blankIcon = this._blankGif;
			var url = com.ibm.social.incontext.util.proxy(com.beas.pwd.config.url + "/listexternals?OpenAgent");
			var myStore = new JsonRest({target:url});
			var globalNS = this.globalNS || "";
			if (globalNS.length > 0) {
				globalNS = globalNS + ".";
			}
			function formatter(fields){
				var docunid = fields[0];
				var  name = fields[1];
				var reset = '<button class="lotusBtn lotusBtnSpecial" onclick="' + globalNS + 'resetPW(' + "'" + docunid + "','" + name + "'" + ')">' + thisWidget.nls.resetPwdBtn.label + '</button>'
				var edit = '<button class="lotusBtn lotusBtnSpecial" onclick="' + globalNS + 'editUSR(' + "'" + docunid + "','" + name + "'" + ')">' + thisWidget.nls.editUsrBtn.label + '</button>'
				var del = '<button class="lotusBtn lotusBtnSpecial" onclick="' + globalNS + 'deleteUSR(' + "'" + docunid + "','" + name + "'" + ')">' + thisWidget.nls.delUsrBtn.label + '</button>'
				return reset + "&nbsp;&nbsp;" + edit + "&nbsp;&nbsp;" + del;
			};

			/*set up layout*/
			var layout = [[
			               {name:this.nls.nameCol.label, field:"name", width: this.nls.nameCol.width},
			               {name:this.nls.emailCol.label, field:"mail", width: this.nls.emailCol.width},
			               {name:this.nls.companyCol.label, field:"company", width: this.nls.companyCol.width},
			               {name:this.nls.actionCol.label, fields:["docunid","name"], formatter: formatter, width: this.nls.actionCol.width}
			               ]];

			/*create a new grid*/
			this.grid = new EnhancedGrid({
				id: 'grid',
				store: dataStore = new ObjectStore({objectStore: myStore}),
				structure: layout,
				rowSelector: '20px',
				canSort: false,
				plugins: {
					pagination: {
						defaultPageSize: 5,
						pageSizes: ["5", "10", "25", "50", "All"],
						description: true,
						sizeSwitch: true,
						pageStepper: true,
						/* we hide the gotoButton becase it is not shown nicely */
						gotoButton: false,
						/*page step to be displayed*/
						maxPageStep: 4,
						/*position of the pagination bar*/
						position: "bottom"
					}
				}
			});

		},
		showDialog: function() {
			this.show();
			dojo.setStyle(this.domNode,"top","100px");
			this.grid.placeAt(this.id + "_gridContainer");
			this.grid.startup();
			if (this.isClosed) {
				this.isClosed = false;
				this.refreshGrid();
			}
		},
		cancelDialog: function() {
			this.writeMessage("","");
			this.isClosed=true;
			this.onCancel();
		},
		refreshGrid: function() {
			this.grid._refresh();
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
		}
	});
});
