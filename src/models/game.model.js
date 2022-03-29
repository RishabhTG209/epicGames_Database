const mongoose = require('mongoose')


const gameSchema = new mongoose.Schema({
    game_id: {type: Number, required: true},
    title: {type: String, required: true},
    discount: {type: Number, required: true},
    price: {type: Number, required: true},
    discription: {type: String, required: true},
    logo: {type: String, required: true},
    image: {type: String, required: true}
    // Video URL
})

module.exports = mongoose.model('game',gameSchema)