dojo.provide("com.beas.pwd.extapplication");

dojo.require("com.beas.pwd.extusrlist");

(function(){
	var pwd = com.beas.pwd;
	
	pwd.extusrdlg = new com.beas.pwd.extusrlist('com.beas.pwd.extusrdlg');
	pwd.showList = function(ctx) {
		pwd.extusrdlg.showDialog();
	}; 

})();

