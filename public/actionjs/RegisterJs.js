//register form validation
var RegisterName=document.getElementById('registername');
var RegisterPhone=document.getElementById('registerphone');
var RegisterPassword=document.getElementById('registerpassword');
var NameRegex=/^[a-zA-Z ]+$/;
var PhoneRegex=/^[0-9]+$/;
var RegisterError=$('.register-header');
var registerError="";

//adding the various event listeners
RegisterName.addEventListener('blur',ValidateName,true);
RegisterPhone.addEventListener('blur',ValidatePhone,true);
RegisterPassword.addEventListener('blur',ValidatePassword,true);


//adding the vaious event handlers
function ValidateName() {
    if(RegisterName.value!="" && RegisterName.value.match(NameRegex)){
        return true;
        RegisterError.html('');
    }
}

function ValidatePhone() {
    if(RegisterPhone.value!="" && RegisterPhone.value.match(PhoneRegex) && RegisterPhone.value.length==10){
        return true;
        RegisterError.html('');
    }
}
function ValidatePassword() {
    if(RegisterPassword.value!="" && RegisterPassword.value.length>=4){
        return true;
        RegisterError.html('');
    }
}

//validating the form submission

function ValidateRegisterationDetails(){
    if(RegisterName.value=="" || !RegisterName.value.match(NameRegex)){
        registerError=`<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><p class="msg">invalid username</p></div>`;
        RegisterError.html(registerError);
        RegisterName.focus();
        return false;
    }
    if(RegisterPhone.value=="" || !RegisterPhone.value.match(PhoneRegex) || RegisterPhone.value.length<10){
        registerError=`<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><p class="msg">invalid phone number</p></div>`;
        RegisterError.html(registerError);
        RegisterPhone.focus();
        return false;
    }
    if(RegisterPassword.value=="" || RegisterPassword.value.length<4){
        registerError=`<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><p class="msg">password must have a minimum of 4 charaters</p></div>`;
        RegisterError.html(registerError);
        RegisterPassword.focus();
        return false;
    }

};

//end of the register form validation
