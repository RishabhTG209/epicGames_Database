const express = require('express');

const Game = require('../models/game.model')

const router = express.Router()


//Post Data
router.post("/",async(req,res)=>{
    try {
        const games = await Game.create(req.body);

        return res.send(games)
    } catch (error) {
        return res.send(error.message)
    }
})


//Get all
router.get("/",async(req,res)=>{
    try {
        const games = await Game.find().lean().exec()

        return res.send(games)
    } catch (error) {
        return res.send(error.message)
    }
})

// Get Particulaar
router.get("/:id",async (req,res)=>{
    try{
        const game= await Game.findById(req.params.id).lean().exec()
        return res.send(game);
    }
    catch(err){
        console.log(res);
    }
})
// Patch
router.patch("/:id",async (req,res)=>{
    try{
        const game= await Game.findByIdAndUpdate(req.params.id,req.body,{
            new: true
        }).lean().exec()
        return res.send(game);
    }
    catch(err){
        console.log(res);
    }
})

// Delete
router.delete("/:id",async (req,res)=>{
    try{
        const game= await Game.findByIdAndDelete(req.params.id).lean().exec()
        return res.send(game);
    }
    catch(err){
        console.log(res);
    }
})

module.exports = router