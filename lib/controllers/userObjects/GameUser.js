// Game User is a League user with another parameter - {attending : Number}
// {'_id' : userObj._id, 'position' : realPosition, form : [], isInvite : isInvite,  date: Date()}
var Constants = require('../../utils/Constants');

var attending;
var _id;
var position;
var form;
var isInvite;
var date;
var team;
module.exports = function(leagueUser, attending) {
  this.attending = attending ? attending : Constants.GAME_ATTENDING_UNDECIDED.status;
  this._id = leagueUser._id;
  this.position = leagueUser.position;
  this.form = leagueUser.form;
  this.isInvite = leagueUser.isInvite;
  this.date = Date();
  this.team = 0;
}
