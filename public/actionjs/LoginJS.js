//adding the login validation
var loginPhone=document.getElementById('phone');
var LoginPassword=document.getElementById('password');
var LoginError=$('.login-header');
var errorMsg="";
//adding the event listeners to validate the user activities
loginPhone.addEventListener('blur',ValidatePhone,true);
LoginPassword.addEventListener('blur',ValidatePassword,true);

//adding the event handlers to check the state of the user activities
function ValidatePhone(){
    if(!loginPhone.value==""){
        LoginError.html('');
        return true;
    }
};
function ValidatePassword(){
    if(!LoginPassword.value==""){
        LoginError.html('');
        return true;
    }
};
function ValidateLogin(){
    if(loginPhone.value==""){
        errorMsg=`<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><p class="msg">PhoneNumber Required</p></div>`;
        LoginError.html(errorMsg);
        loginPhone.focus();
        return false;
    };
    if(LoginPassword.value==""){
        errorMsg=`<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><p class="msg">Password Required</p></div>`;
        LoginError.html(errorMsg);
        LoginPassword.focus();
        return false;

    }
}
//end of the login validation