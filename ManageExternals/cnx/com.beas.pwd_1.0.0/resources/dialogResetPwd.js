dojo.provide("com.beas.pwd.dialogResetPwd");

dojo.require("com.beas.pwd.resetpassword");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.dialogResetPwd = new com.beas.pwd.resetpassword();

	pwd.showResetPwd = function(ctx) {
		pwd.dialogResetPwd.showDialog('1234','Hans Dampf');
	}; 

})();

