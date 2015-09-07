// // User
//
// var mongoose     = require('mongoose');
// var Schema       = mongoose.Schema;
// var Constants = require('../utils/Constants.js');
//
// // League
// var LeagueSchema   = new Schema({
//     name: {type : String, required : true, unique: true },
//     users: [String],
//     admin : {type : String, required : true },
//     dateCreated: { type: Date, default: Date.now },
//     startDate: { type: Date, default: Date.now },
//     endDate: {type: Date, default: Date.now},
//     frequency : {type: Number, required: true, default : Constants.GAME_FREQUENCY_NEVER},
//     games: [String]
//
// });
//
// module.exports.League = mongoose.model('League', LeagueSchema);
