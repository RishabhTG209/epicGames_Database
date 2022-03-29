const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId, ref:"user",required:true
    },
    game_id: 
        {type:mongoose.Schema.Types.ObjectId, ref:"game",required:true}
})

module.exports = mongoose.model('cart',cartSchema)