const mongoose = require('mongoose')
const PlayerSchema = new mongoose.Schema({
    // what currentWordIndex does is to keep track of what word 
    // the user is on
    currentWordIndex: {
        type: Number,
        default: 0,
    },

    // every socket has a unique identifier, so we are gonna keep
    // track of this and we could use it at the front end
    socketID: {type: String},

    // false means you are not the room host
    isPartyLeader: {type: Boolean, default: false},

    // word per minute, setting -1 to represent we haven't calculted 
    // the WPM yet
    WPM:{type: Number, default: -1},

    nickName: {type: String}
})

const GameSchema = new mongoose.Schema({
    words: [{type: String}],

    // whether the room is joinable or not
    isOpen: {type: Boolean, default: true},

    // keep track of whether the game is officially over
    isOver: {type: Boolean, default: false},

    players: [PlayerSchema],

    // using start time for knowing when the game started in
    // order to be able to calculate the WPM
    startTime: {type: Number}
})

module.exports = mongoose.model('Game', GameSchema)