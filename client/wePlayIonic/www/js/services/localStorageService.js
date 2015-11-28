angular.module('app.services')
.service('localStorageService', function() {

  var getClientId = function() {
    window.localStorage. = JSON.stringify('clientId');
  };

  var setClientId = function(clientId){
    return JSON.parse(window.localStorage. || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});
