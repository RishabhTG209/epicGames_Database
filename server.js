const express = require('express')
const cors = require('cors')
const body_parser = require("body-parser")
const connect = require("./src/configs/db")
const gameSchema= require("./src/controllers/game.controller")
const cartSchema= require("./src/controllers/cart.controller")
const userSchema= require("./src/controllers/user.controller")
const {register, login,newToken} = require("./src/controllers/auth_controller")
const passport = require("./src/configs/google-oauth");

const app = express()

require('dotenv').config();
const PORT = process.env.PORT || 3125;
app.use(body_parser.json())


const corsOptions = {
  origin: '*',
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});


app.use("/games",gameSchema)
app.use("/cart",cartSchema)
app.use("/user",userSchema)
app.post("/register",register);
app.post("/login",login);

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/auth/google/failure",
    }),
    (req, res) => {
      const { user } = req;
      const token = newToken(user);
      localStorage.setItem("userData",JSON.stringify(user));
      return res.send({ user, token });
    }
  );
  
app.listen(PORT, async () =>{
    try{
        await connect()
        console.log(`listen on port ${PORT}`)      
    } catch(error){
        console.log('error:', error.message)
    }
})