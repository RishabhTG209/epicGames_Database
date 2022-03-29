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

app.use(cors())



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
  
      return res.send({ user, token });
    }
  );
  
app.listen(PORT, async () =>{

    try {
        await connect()
        console.log(`listen on port ${PORT}`)
        
    } catch (error) {
        console.log('error:', error.message)
    }
})