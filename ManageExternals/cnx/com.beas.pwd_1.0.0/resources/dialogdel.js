dojo.provide("com.beas.pwd.dialogdel");

dojo.require("com.beas.pwd.delwidget");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.dialogdel = new com.beas.pwd.delwidget();

	pwd.showDel = function(ctx) {
		pwd.dialogdel.showDialog('1234','Hans Dampf');
	}; 

})();

