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
