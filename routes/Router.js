const express=require('express');
const Route=express.Router();
const RegisterUser=require('../controllers/RegisterController');
const initLogin=require('../controllers/LoginController');
const passport=require('passport');
const HomePageController=require('../controllers/homeController');
const LoginService=require('../services/loginServices');
const RegisteredUsers=require('../controllers/RegisteredUsersController')
const ActivePortals=require('../controllers/ActivePortals')
const GetOthersSocket=require('../controllers/GetOthersSocket')
const GetChatMessages=require('../controllers/GetChatMessages')
//initialising the login
initLogin();
//get
Route.get('/',checkAuthenticated,HomePageController.HandleHomePage);
Route.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login');
})
Route.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register');
})
//post
Route.post('/register',RegisterUser);
Route.post('/getFriendsSocket',GetOthersSocket);
Route.post('/getChatMessages',GetChatMessages);

Route.post('/login',passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: true
}))
Route.post('/getRegisteredUsers',RegisteredUsers);
Route.post('/activeSockets',ActivePortals);
Route.post('/logout',async (req,res,done)=>{
 try {
     let id=req.body.logoutID;
     let rows=await LoginService.logoutUser(id);
     if(rows){
         req.session.destroy((error)=> {
             return res.redirect("/");
         });
     }
 }catch (error) {
     console.log(error);
     return done(error);
 }
});


//

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}
module.exports=Route;