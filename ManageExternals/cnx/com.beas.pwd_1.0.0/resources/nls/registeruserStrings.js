// NLS_CHARSET=UTF-8
define({
 root: {
   submit: {label: "Register User", a11y: "Register User", tooltip: "Register User"},
   cancel: {label: "Close", a11y: "Close", tooltip: "Close"},
   close: {label: "Close", a11y: "Close", tooltip: "Close"},
   title: {label: "Register New User"},
   caption: {label: "Register a new external user"},
   name1: {label: "* First name:"},
   name2: {label: "* Last name:"},
   email1: {label: "* Email:"},
   company1: {label: "* Company:"},
   password1: {label: "Password options:"},
   passtext1: {label: "Send email with password to user"}, 
   passtext2: {label: "Display password on screen only"},
   resetNewPwdMsg: "New Password:",
   messages: {
	empty: "Please fill out all required fields.", 
	success: "The user was successfully registered and will be able to login latest after 1.5 hours.",
	unconfigured: "POST URL not defined in config.js. Please contact your administrators.",
	invalidemail: "The provided email is invalid.",
	1: "The provided email address already exists.",
	2: "Another user with the same first name and last name already exists."
   }
 },
 de: true
});

