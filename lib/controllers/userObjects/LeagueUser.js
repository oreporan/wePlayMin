// A League User - {'_id' : userObj._id, 'position' : realPosition, form : [], isInvite : isInvite,  date: Date()}
var Constants = require('../../utils/Constants');

var _id;
var position;
var form;
var isInvite;
var date;

module.exports = function(id, position, isInvite) {
  var realPosition = isValidPosition(position) ? position : Constants.LEAGUE_POSITION_CM.name;
  this._id = id;
  this.position = realPosition;
  this.form = [];
  this.isInvite = isInvite;
  this.date = Date();
}


	function isValidPosition(position) {
		var allPositionssArray = Constants.LEAGUE_ALL_POSITION_NAMES;
		return (allPositionssArray.indexOf(position) > -1);
	}
