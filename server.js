const express = require('express')
const cors = require('cors')
const body_parser = require("body-parser")
const connect = require("./src/configs/db")
const gameSchema= require("./src/controllers/game.controller")
const cartSchema= require("./src/controllers/cart.controller")
const userSchema= require("./src/controllers/user.controller")
const {register, login,newToken} = require("./src/controllers/auth_controller")
const passport = require("./src/configs/google-oauth");

const Razorpay = require("razorpay")

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



// Razorpay
var instance = new Razorpay({
  key_id: "rzp_test_VsoO9BEK2erzgZ",
  key_secret: "IWbeDhHIJTPPJPAlFb85WZU2",
});

//create order id
app.post("/create/orderId", async (req, res) => {
  try {
    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "steve_id_1",
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      // OrderDetails.create(order);
      return res.status(201).send({ orderId: order.id });
    });
  } catch (e) {
    return res.status(500).send({ rzp_ord_err: e.message });
  }
});

//saving details

app.post("/saveOrderDetails", async (req, res) => {
  try {
    const details = await OrderDetails.create(req.body);
    return res.status(201).send(details);
  } catch (e) {
    return res.status(500).send({ orderSaveErr: e.message });
  }
});

//verify signature
app.post("/api/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "Wok5mJv2F0pa5HKLeXZfUr9r")
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.send(response);
});
  
app.listen(PORT, async () =>{
    try{
        await connect()
        console.log(`listen on port ${PORT}`)      
    } catch(error){
        console.log('error:', error.message)
    }
})