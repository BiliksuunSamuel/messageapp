const con=require('../connectDB/dbConfig');
const bcrypt=require('bcrypt');

var cmd="";
const RegisterUser=(req,res,done)=>{
  const user= {
     name: req.body.registername,
     phone: req.body.registerphone,
     password: req.body.registerpassword
  };
  //checking the register phonenumber
   cmd="select * from users where PhoneNumber=?";
   con.query(cmd,[user.phone],function(error,rows){
      if(error) throw  error;
      if(rows.length>0){
         res.render('register',{error:`this PhoneNumber ${user.phone} is already registered`,'name':user.name,'phone':user.phone});
      }
      else{
         //hashing the user pasword
          bcrypt.hash(user.password,10,function (error,hash) {
          if(error) throw error;
          user.password=hash;
          cmd="insert into users(Name,PhoneNumber,Password) values(?,?,?)";
          con.query(cmd,[user.name,user.phone,user.password],function (error,rows) {
            if(error)throw error;
            req.flash('success_message','Registration Successfull,please login');
            res.redirect('/login');
          })
          })
      }
   })


























}
module.exports=RegisterUser;