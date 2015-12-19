// Game User is a League user with another parameter - {attending : Number}
// {'_id' : <id>, form : [], isInvite : <bool>,  date: Date(), team : <int>, attending : <int>}
var Constants = require('../../utils/Constants');

var attending;
var _id;
var form;
var isInvite;
var date;
var team;
module.exports = function(leagueUser, attending) {
  this.attending = attending ? attending : Constants.GAME_ATTENDING_UNDECIDED.status;
  this._id = leagueUser._id;
  this.form = leagueUser.form;
  this.isInvite = leagueUser.isInvite;
  this.date = Date();
  this.team = 0;
}
