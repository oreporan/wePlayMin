
module.exports.isDuplicateError = function(error) {
  if(error.errmsg.indexOf("duplicate key error") > -1 ) {
    return true;
  }
  return false;
};

module.exports.getDuplicateErrorField = function(error) {
  var str = error.errmsg;
  var start = str.indexOf('{ :');
  var end = str.indexOf(' }');
  var value = str.substring(start + 3, end);
  return value;
};
