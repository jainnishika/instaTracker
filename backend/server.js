require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

const verifyToken = (req,res,next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({message:"No token"});

  try{
    jwt.verify(token, SECRET);
    next();
  }catch{
    res.status(401).json({message:"Invalid token"});
  }
};

app.post("/signup", async(req,res)=>{
  const {username,email,password}=req.body;
  const hash = await bcrypt.hash(password,10);

  db.query(
    "INSERT INTO users(username,email,password) VALUES(?,?,?)",
    [username,email,hash],
    ()=>res.json({message:"User created"})
  );
});

app.post("/login",(req,res)=>{
  const {email,password}=req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async(err,result)=>{
      if(result.length===0) return res.status(400).json({message:"No user"});

      const user=result[0];
      const ok = await bcrypt.compare(password,user.password);

      if(!ok) return res.status(400).json({message:"Wrong password"});

      const token = jwt.sign({id:user.id},SECRET);
      res.json({token});
    }
  );
});

app.listen(5000, ()=>console.log("Server running"));