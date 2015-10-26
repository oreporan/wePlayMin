// Game User is a League user with another parameter - {attending : Number}
// {'_id' : userObj._id, 'position' : realPosition, form : [], isInvite : isInvite,  date: Date()}

var attending;
var _id;
var position;
var form;
var isInvite;
var date;

module.exports = function(leagueUser, attending) {
  this.attending = attending;
  this._id = leagueUser._id;
  this.position = leagueUser.position;
  this.form = leagueUser.form;
  this.isInvite = leagueUser.isInvite;
  this.date = Date();
}
