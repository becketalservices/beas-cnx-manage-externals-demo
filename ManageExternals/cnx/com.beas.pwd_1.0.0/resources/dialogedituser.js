dojo.provide("com.beas.pwd.dialogedituser");

dojo.require("com.beas.pwd.edituser");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.editdialog = new com.beas.pwd.edituser();

	pwd.showEdit = function(ctx) {
		pwd.editdialog.showDialog("978300DEC00F77C0C1257EA200639937");
	}; 

})();

