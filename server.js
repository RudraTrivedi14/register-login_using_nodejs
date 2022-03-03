const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const User=require('./model/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const JWT_SECRET='kjbkjwel@#$fl3ifhqo#iyqolvxjhqc$#%$%%eerweer2ryuivwegygfbqiluqlbqueleelfuyt';

mongoose.connect('mongodb://localhost:27017/login');

const app=express();


app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())





app.post('/api/login',async(req,res)=>{
      
    const { username, password }=req.body

    const user=await User.findOne({ username}).lean()

    if(!user){
        return res.json({status:'error',error:'invalid username/password'})
    }

    if(await bcrypt.compare(password,user.password)){

        const token=jwt.sign({ id:user._id,username:user.username},JWT_SECRET)


        return res.json({ status:'done',data:token})

    }




    res.json({status:'error',error:'invalid username/password'})

})

app.post('/api/register',async(req,res)=>{
     console.log(req.body)   
     
     const { username,password:plainTextPassword }=req.body;

     if(!username||typeof username!=='string'){
         return res.json({ status:'error',error:'invalid username'})
     }

     if(!plainTextPassword||typeof plainTextPassword!=='string'){
        return res.json({ status:'error',error:'invalid password'})
    }

    if(plainTextPassword.length<5){
        return res.json({ status:'error',error:'invalid password length,it should be atleast 6 characters'}) 
    }

     const password=await bcrypt.hash(plainTextPassword,10);
     try {

        const response=await User.create({
            username,
            password
        })
        //console.log('user created successfuliy:',response);

         
     } catch (error) {
        //  console.log(JSON.stringify(error));
        if(error.code===11000){
             
            return res.json({status:'error',error:'Username is already used'});
        }
        throw error 
         
         
     }


    res.json({status:'done'})
})


app.listen(3000,()=>{
    console.log('Server on at 3000');
});

