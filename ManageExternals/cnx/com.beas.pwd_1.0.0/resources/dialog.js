dojo.provide("com.beas.pwd.dialog");

dojo.require("com.beas.pwd.pwdwidget");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.dialog = new com.beas.pwd.pwdwidget();

	pwd.show = function(ctx) {
		pwd.dialog.showDialog();
	}; 

})();

