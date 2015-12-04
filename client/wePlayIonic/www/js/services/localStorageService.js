angular.module('app.services')
.service('localStorageService', function(logger) {

  var setByKey = function(key, object) {
    if (key && object) {
      window.localStorage.setItem(key, object);
    }
  };

  var getByKey = function(key){
    if (key) {
      return window.localStorage.getItem(key);
    }
  };

  var removeItem = function(key){
    if (key) {
      return window.localStorage.removeItem(key);
    }
  };

  return {
    removeItem: removeItem,
    getByKey: getByKey,
    setByKey: setByKey
  };
});
