const express=require('express')
const cors=require('cors')
const app=express()
app.use(cors())
app.use(express.json())
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mysql=require('mysql')
const {makeDb}=require('mysql-async-simple')
function sqlconnect(){
    return mysql.createConnection({
    host:'3.7.198.191',
    user:'bu-trausr',
    password:'r9*rwr$!usFw0MCPj#fJ',
    database:'bu-training',
    port:'8993'
})
}
const db=makeDb()
//generate JWT token for User & Password
app.post('/loginAuth',async (req,res)=>{
    let emailss=req.body.email
    let passwordd=req.body.password
    var connection=sqlconnect()
    await db.connect(connection);
//    res.json({emailss,passwordd})
    let uploadedFileName=await db.query(connection,`select email,password from LoginData where email='${emailss}' and password='${passwordd}'`)
   try {
    if(uploadedFileName.length==0){
       throw "User Value Not available"
    }else{
        let tokens=jwt.sign({email:emailss,password:passwordd},'shhhshhsh',{expiresIn:'1d'})
        let uploadedFileName1=await db.query(connection,`UPDATE LoginData
        SET token = '${tokens}'
        WHERE email = '${uploadedFileName[0].email}' and password='${uploadedFileName[0].password}';`)
       if(uploadedFileName1){
        res.json("Successs")
       }
    }
   } catch (error) {
    res.json(error)
   }

})

//clear a token from database
app.get('/logOut/:id',async (req,res)=>{
    id=req.params.id
    var connection=sqlconnect()
    await db.connect(connection);
    try {
        let uploadedFileName1=await db.query(connection,`UPDATE LoginData
        SET token = ''
        WHERE id = '${id}'`)
        if(uploadedFileName1){
            res.json({message:"Token Removed"})
        }else{
            throw "Already LogOut"
        }
    } catch (error) {
        res.json({message:error})
    }
})
//function to check there role
const RolebaseAuth = (role) => {
    return async (req, res, next) => {
        try {
            var connection = sqlconnect(); 
            await db.connect(connection);
            var roleOfUser = await db.query(connection, `SELECT role FROM LoginData WHERE id = ${req.headers.id}`);
            if (roleOfUser && roleOfUser.length > 0) {
                if (role !== roleOfUser[0].role) {
                 throw"Only Admin has Authorization"
                } else {
                    next();
                }
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({error});
        }
    };
};
//get all user data
app.get('/getAllUser',RolebaseAuth('admin'),async(req,res)=>{
    var connection=sqlconnect()
    await db.connect(connection);
    try {
        var uploadedFileName=await db.query(connection,`select * from LoginData`)
        if(uploadedFileName){
            req.json({Datas:uploadedFileName})
        }else{
            throw "ERROR DETECTED!"
        }
        
    } catch (error) {
        res.json({uploadedFileName})
    }

})
//function to encript a get exact user data
const GetDataOfUser = () => {
    return async (req, res, next) => {
        try {
            var connection = sqlconnect(); 
            await db.connect(connection);
            let id=req.params.id
            var roleOfUser = await db.query(connection, `SELECT id FROM LoginData WHERE id = ${req.headers.id}`);
            console.log(roleOfUser[0].id)
            if (roleOfUser && roleOfUser.length > 0) {
                if (id == roleOfUser[0].id) {
                    next();
                 
                } else {
                    throw "UnAuthorization"
                   
                }
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({error});
        }
    };
};
//getDataById
app.get('/getAllUser/:id',GetDataOfUser(),async(req,res)=>{
    var connection=sqlconnect()
    await db.connect(connection);
    let id=req.params.id
    try {
        var uploadedFileName=await db.query(connection,`select * from LoginData where id=${id}`)
        if(uploadedFileName){
            req.json({Datas:uploadedFileName})
        }else{
            throw "ERROR DETECTED!"
        }
        
    } catch (error) {
        res.json({uploadedFileName})
    }

})
//Update Password
app.post('/UpdateData',async(req,res)=>{
    let id=req.body.id
    let existingPassword=req.body.existingPassword
    let NewPassword=req.body.NewPassword
    let confirmPassword=req.body.confirmPassword
    var connection=sqlconnect()
    await db.connect(connection);
    var uploadedFileName=await db.query(connection,`select * from LoginData where id=${id}`)

   if(existingPassword!==uploadedFileName[0].password){
    res.status(400).send("Existing Password are not valid")
   }else{
    try {
        if(uploadedFileName && uploadedFileName.length>0){
            if(confirmPassword==NewPassword){
                var setPassword=await db.query(connection,`UPDATE LoginData SET password = '${NewPassword}' WHERE id=${id};`)
               if(setPassword){
                res.json({message:"Updated SuccessFully"})
               }
            }else{
                res.send("New Password are not same")
            }
        }else{
            throw "Invalid Datas"
        }
        
    } catch (e) {
        res.json({e})
    }
   }
})


app.post('/verifyToken',(req,res)=>{
    var token=req.body.token
    // jwt.verify(token, 'shhhshhsh', function(err, decoded) {
    //     if (err) {
    //         res.json(err)
    //     }else{
    //         console.log(decoded)
    //         res.json(decoded)
    //     }
    //   });
      try {
        var decoded = jwt.verify(token, 'shhhshhsh');
         res.json(decoded)
      } catch(err) {
        res.json(err)
      }
})

//sending mail

app.post('/send_email', (req, res) => {
    const { name, email, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'bala01225@gmail.com', 
        pass: 'hxwcvysxejluinqy'
      }
    });
  
    
    const mailOptions = {
      from: email,
      to: 'recipient@example.com',
      subject: 'New Message from ODERZIT Contact Form',
      text: `<b>Name</b>: ${name}\<b>Email</b>: ${email}\<b>Message</b>: ${message}`
    };
  
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });
  

app.listen(8080,()=>{
    console.log("Server is live now")
})