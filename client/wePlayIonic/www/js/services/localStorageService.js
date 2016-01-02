angular.module('app.services')
  .service('localStorageService', function(logger, constants) {


    var setByKey = function(key, object) {
      if (key && object) {
        window.localStorage.setItem(key, object);
      }
    };

    var getByKey = function(key) {
      if (key) {
        return window.localStorage.getItem(key);
      }
    };

    var removeItem = function(key) {
      if (key) {
        window.localStorage.removeItem(key);
      }
    };

    var clientId = getByKey(constants.STORAGE_CLIENTID);

    var getClientId = function() {
      if (clientId) {
        return clientId;
      }
      clientId = getByKey(constants.STORAGE_CLIENTID);
      return clientId;
    }

    return {
      removeItem: removeItem,
      getByKey: getByKey,
      setByKey: setByKey,
      getClientId: getClientId
    };
  });
