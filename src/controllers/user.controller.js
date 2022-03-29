const express = require('express');

const User = require('../models/user.model')

const router = express.Router()


//Post Data
router.post("/",async(req,res)=>{
    try {
        const users = await User.create(req.body);

        return res.send(users)
    } catch (error) {
        return res.send(error.message)
    }
})

//Get all
router.get("/",async(req,res)=>{
    try {
        const users = await User.find().lean().exec()

        return res.send(users)
    } catch (error) {
        return res.send(error.message)
    }
})


// Get Particulaar
router.get("/:id",async (req,res)=>{
    try{
        const user= await User.findById(req.params.id).lean().exec()
        return res.send(user);
    }
    catch(err){
        console.log(res);
    }
})
// Patch
router.patch("/:id",async (req,res)=>{
    try{
        const user= await User.findByIdAndUpdate(req.params.id,req.body,{
            new: true
        }).lean().exec()
        return res.send(user);
    }
    catch(err){
        console.log(res);
    }
})

// Delete
router.delete("/:id",async (req,res)=>{
    try{
        const user= await User.findByIdAndDelete(req.params.id).lean().exec()
        return res.send(user);
    }
    catch(err){
        console.log(res);
    }
})



module.exports = router