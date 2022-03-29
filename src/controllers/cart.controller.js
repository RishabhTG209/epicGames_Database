const express= require("express");

const router = express.Router();

const cart = require("../models/cart.model")


// Get all
router.get("/",async(req,res)=>{
    try {
        const carts = await cart.find().lean().exec()

        return res.send(carts)
    } catch (error) {
        return res.send(error.message)
    }
})

// Fetching Data from the cart
router.get("/:id", async (req,res)=>{
    try{
        const cart_data= await cart.find({user_id:req.params.id}).populate("user_id game_id").lean().exec()

        res.status(200).send(cart_data)

    }catch(e){

        res.send(e.message)

    }

});

// Pushing into Cart
router.post("/additem/:user_id", async (req,res)=>{

    try{
        const game_id=req.body.game_id;
        const user_id = req.params.user_id;

        const cart_item= await cart.findOne({"user_id":user_id,"game_id":game_id}).lean().exec();
           await cart.create(req.body);
           
           res.end()

    }catch(e){

        res.send(e.message)

    }

});

// Delete from cart
router.delete("/:game_id" ,async (req,res)=>{

    try{

        let game_id = req.params.product_id;
        let user_id =req.body.user_id;
        let item =  await cart.findOne({"game_id":game_id ,"user_id":user_id});

        await cart.findByIdAndDelete(item._id);

        res.end();
    }catch(err){
        res.send("error while deleting item",err.message)
    }

})

module.exports=router;