const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const LoginService=require('../services/loginServices');

let initLogin=()=>{
    passport.use(new localStrategy({
        usernameField:'phone',
        passwordField:'password',
        passReqToCallback:true
    },async(req,phone,password,done)=>{
       try {
           let user=await LoginService.getUserByPhone(phone);
           if(!user){
               return done(null,false,req.flash('error','incorrect login user phone'));
           }
           let match=await LoginService.CompareUserPassword(password,user);
           if(match===true){
               try {
                   let rows=LoginService.updateLogin(user.id);
               }catch (error) {
                 console.log(error);
                 return done(null,error)
               }
               return done(null,user);
           }
           else{
               return done(null,false,req.flash('error','incorrect login user password'));
           }
       }catch (error) {
           console.log(error);
           return done(null,false,error);
       }
    }))
}
passport.serializeUser((user,done)=>{
    return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    LoginService.getUserByID(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
})



module.exports = initLogin;