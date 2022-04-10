const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const {User} = require('./model/Schema');

const app = express();
let server = app.listen(8000);

// app.use(express.static("public"));

const url = "mongodb+srv://JSoorajKrishna:12345@pollbooth.cgszb.mongodb.net/authentication";
mongoose.connect(url)
        .then(()=>{console.log("connected to the database")})
        .catch((err)=>console.log(err));



app.post("/signup",(req,res)=>{
    res.send("hi");
});

app.post("/login",(req,res)=>{
    res.send("hi");
});

let io = socket(server,{ cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  }});

io.on("connection",(socket) =>{
    console.log("socket connection is established", socket.id);
});