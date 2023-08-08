const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


const JWT_SECRET = "bmsjsyerdgsberywhaqws{}aiyg8t87qt74314625421h78ttq3ifi764376bkj?[]]pou89ywe";



const mongoUrl="mongodb+srv://nderitulornah040:eGXndeOZugowlUqX@cluster0.bvvsry5.mongodb.net/?retryWrites=true&w=majority"

    mongoose
    .connect(mongoUrl,{
        useNewUrlParser:true
    })
    .then(()=>{console.log("connected to database");
    })
    .catch(e=>console.log(e));

    require("./userDetails");

    const User = mongoose.model("UserInfo");

//  signup
app.post("/register", async (req, res) => {
  const { fname, lname, email, password,} = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.json({ error: "User Exists" });
        }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


app.post("/login-user", async (req,res) =>{
  const {email,password} =req.body

  const user = await User.findOne({ email });
  
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if ( await bcrypt.compare(password,user.password)){
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
//  const token = jwt.sign({ }, JWT_SECRET, {
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
})

    app.listen(3000,()=>{
    console.log("server started");
    })

    app.post("/userData", async (req, res) => {
      const { token } = req.body;
      try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
          if (err) {
            return "token expired";
          }
          return res;
        });
        console.log(user);
        if (user == "token expired") {
          return res.send({ status: "error", data: "token expired" });
        }
    
        const useremail = user.email;
        User.findOne({ email: useremail })
          .then((data) => {
            res.send({ status: "ok", data: data });
          })
          .catch((error) => {
            res.send({ status: "error", data: error });
          });
      } catch (error) { }
    });
    
    app.listen(5000, () => {
      console.log("Server Started");
    });
 

app.post("/post", async(req,res)=>{
    console.log(req.body);
    const {data}=req.body;

    try{
        if (data =="jayy"){
            res.send({status:"ok"})
        } else{
            res.send({status:"user not found"})
        }
    } catch (error){
        res.send({status:"something went wrong try again"})
    }

   
})