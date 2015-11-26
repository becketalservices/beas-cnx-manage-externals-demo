define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dijit/Dialog',
        'dojo/text!./templates/helpwidget.html',
        'dojo/i18n!./nls/pwdwidgetStrings'
        ], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog, template, nls) {
	return declare("com.beas.pwd.helpwidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Dialog], {
		version: '201508151300',
		templateString: template,
		nls: nls,
		blankIcon: "",
		postMixInProperties: function() {
			this.inherited(arguments);
			this.blankIcon = this._blankGif;
		},
		showDialog: function() {
			this.show();
			dojo.setStyle(this.domNode,"top","75px");
		},
		cancelDialog: function() {
			this.onCancel();
		}
	});
});
