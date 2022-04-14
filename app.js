const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const {User} = require('./model/Schema');
const Auction = require("./model/eAuctionSchema");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const app = express();


let server = app.listen(8000);
app.use(express.json());
app.use(cookieParser());

const url = "mongodb+srv://JSoorajKrishna:12345@pollbooth.cgszb.mongodb.net/delta";
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{console.log("connected to the database")})
        .catch((err)=>console.log(err));



app.use(cors({
    origin: 'http://localhost:3000'
  }));

//   const multer = require('multer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public')
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' +file.originalname)
//   }
// })

// const upload = multer({ storage: storage }).single('file')




let io = socket(server,{ cors: {
  origin: "http://localhost:3000",
  // methods: ["GET", "POST"],
  // allowedHeaders: ["my-custom-header"],
  // credentials: true
}});

io.on("connection",(socket) =>{
  console.log("socket connection is established", socket.id);
  socket.on('amount',function(data){
    io.sockets.emit('amount',data);
    Auction.findById(data.id)
          .then((auctions)=>{
              auctions.auctionendingamount = data.amount;
              auctions.auctiontakenby = data.username;
              auctions.save();
          })
          .catch(err=>console.log(err));
          // io.sockets.emit('amount',data);
  });
});






app.get("/dashboard",(req,res)=>{
  Auction.find()
          .then((auctions)=>{
              res.send(auctions);
          })
          .catch(err=>console.log(err));
});

app.get("/dashboard/:id",(req,res)=>{
  const id = req.params.id;
  Auction.findById(id)
          .then((auctions)=>{
              res.send(auctions);
          })
          .catch(err=>console.log(err));
});




app.post('/sellgood',  (req, res) => {
  const auction = new Auction(req.body);
  auction.save();
  // console.log(req.body);
  res.send("Auction saved successfully");
  

  // upload(req, res, (err) => {
  //   if (err) {
  //     res.sendStatus(500);
  //   }
  //   console.log(req.file);
  //   res.send(req.file);
  // });


});


const createToken = (id)=>{
  return jwt.sign({id},'eAuction');
};


app.post("/signup",(req,res)=>{
    const user = new User(req.body);
    const token = createToken(user._id);
    console.log(token);
    // res.cookie("jwt",token,{httpOnly: true, maxAge: 100000});
    user.save();
    res.send({userid: user._id,token,username: user.username});
});

app.post("/login",(req,res)=>{
  let user;
    User.findOne({email: req.body.email})
        .then(user1=>{
          user = user1;
          return bcrypt.compare(req.body.password, user1.password);
        })
        .then(data=>{
          if(data)
          {
            const token = createToken(user._id);
            res.send({userid: user._id,token,username: user.username});
          }
          else{
            res.send("Incorrect Password");
          }
        }).catch(err=>{
          console.log(err);
          res.send("Invalid mail id");
        });
});