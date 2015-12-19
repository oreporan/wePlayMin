// A League User - {'_id' : userObj._id, 'position' : realPosition, form : [], isInvite : isInvite,  date: Date()}
var Constants = require('../../utils/Constants');

var _id;
var form;
var isInvite;
var date;

module.exports = function(id, isInvite) {
  this._id = id;
  this.isInvite = isInvite;
  this.date = Date();
}
