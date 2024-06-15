require("dotenv").config();
const mongoose = require("mongoose");
http = require('http');
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cors=require("cors")
const post = require("./routes/Post");
const bodyParser = require("body-parser");
const register=require("./routes/User")
const search=require("./routes/Search")
const fileupload=require("express-fileupload")
const dbUrl = process.env.MONGO_DB;
const user=require("./routes/User")

const server = http.createServer(app); 
//mongooseUrl
        mongoose.connect(dbUrl);
        mongoose.connection.on("error", (err) => {
        console.log(err);
        console.log("connection failed");
        });
        mongoose.connection.on("connected", (connected) => {
        console.log("connected");
        });
//bod-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(fileupload({
        useTempFiles:true
}))

const io =new Server(server,{
        cors:{
                origin:"http://localhost:3000" ,
                methods:['GET','POST']
        },
})

io.on('connection', (socket) => {
        console.log(`User connected `);
        socket.on('chat message', function(msg){
                io.emit('chat message', msg);
              });
        socket.on("disconnect",function(){
                console.log(`user disconnected`);
        })
      });

app.use("/user",user)
app.use("/post",post)
app.use("/search",search)


server.listen(9090, console.log("app is running"));
