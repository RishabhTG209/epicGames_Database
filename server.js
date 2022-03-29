const express = require('express')
const cors = require('cors')
const body_parser = require("body-parser")
const connect = require("./src/configs/db")
const app = express()

require('dotenv').config();
const PORT = process.env.PORT || 3125;
app.use(body_parser.json())

app.use(cors())

const gameSchema= require("./src/controllers/game.controller")
const cartSchema= require("./src/controllers/cart.controller")
const userSchema= require("./src/controllers/user.controller")
const {register, login} = require("./src/controllers/auth_controller")

app.use("/games",gameSchema)
app.use("/cart",cartSchema)
app.use("/user",userSchema)
app.post("/register",register);
app.post("/login",login);

app.listen(PORT, async () =>{

    try {
        await connect()
        console.log(`listen on port ${PORT}`)
        
    } catch (error) {
        console.log('error:', error.message)
    }

})