// User

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../utils/Constants.js');

var UserSchema   = new Schema({
    name: {type : String, required : true, unique: true },
    email : {type : String, required : true, unique: true},
    password : {type : String, required: true, select: false},
    leagues: [{ type: String, minlength : 3 }],
    dateCreated: { type: Date, default: Date.now },
    attending: { type: Number, min: -1, max: 1 , default : 0},
});

module.exports.User = mongoose.model('User', UserSchema);

// Game
var Schema       = mongoose.Schema;

var GameSchema   = new Schema({
    LeagueId : {type : String, required: true},
    users : [UserSchema],
    dateCreated: { type: Date, default: Date.now },
    teamA : [UserSchema],
    teamB : [UserSchema],
    invites : [UserSchema]
});

module.exports.Game = mongoose.model('Game', GameSchema);



// League
var Schema       = mongoose.Schema;

var LeagueSchema   = new Schema({
    name: {type : String, required : true },
    _id: {type : String, required : true },
    users: [String],
    admin : {type : String, required : true },
    dateCreated: { type: Date, default: Date.now },
    startDate: { type: Date, default: Date.now },
    endDate: {type: Date, default: Date.now},
    frequency : {type: String, required: true, default : Constants.GAME_FREQUENCY_NEVER},
    games: [GameSchema]

});

module.exports.League = mongoose.model('League', LeagueSchema);
