import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import bcrypt from "bcrypt";
import pg from "pg";
import http from "http";
import {Server} from "socket.io";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app=express();
const saltRounds = 10;
const port =3000;

//Middle ware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//DB
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Zoom-DataBase",
  password: "samsathshah45",
  port: 5433,
});
db.connect();

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});


app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
      console.log("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          res.send("successfull");
        //   const user=result.rows[0];
        //   req.login(user,(err)=>{
        //     console.log("success");
        //     res.redirect("/secrets");
        //   })
          
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});


//Login
app.post("/login",async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try{
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email]);
    if(result.rows.length>0)
    {
        const user=result.rows[0];
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err)
            {
                console.error("Error comparing passwords:", err);
                res.status(500).send("Internal server error");
            }
            else if(result)
            {
                console.log("Login successful");
                res.send("Login successful");
            }
            else
            {
                console.log("Invalid credentials");
                res.status(401).send("Invalid credentials");
            }
        })
    }
    else
    {
        console.log("User not found");
        res.status(404).send("User not found");
    }
  }catch(err)
  {
      console.error("Error during login:", err);
      res.status(500).send("Internal server error");
  }
})

// app.post("/host", async (req, res) => {
//   const room = req.body.roomId;
//    console.log(room);
//   try{
   
//     const result=await db.query("INSERT INTO meetings (meeting_code,host_id) VALUES ($1,$2) RETURNING *", [room,20]);
//     console.log(result.rows[0]);
//     console.log("Room created successfully");
//   }catch(err){
//     console.error("Error creating room:", err);
//   }
// });  

app.listen(port,()=>
{
    console.log(`Server is running on port ${port}`);
});