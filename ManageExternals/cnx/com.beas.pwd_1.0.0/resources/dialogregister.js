dojo.provide("com.beas.pwd.dialogregister");

dojo.require("com.beas.pwd.registeruser");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.registerdialog = new com.beas.pwd.registeruser();

	pwd.showRegister = function(ctx) {
		pwd.registerdialog.showDialog();
	}; 

})();

