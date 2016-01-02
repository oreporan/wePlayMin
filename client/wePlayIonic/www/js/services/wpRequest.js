angular.module('app.services')
  .service('wpRequest', function(localStorageService, logger, $http, paths, constants) {

    var wpLogger = logger.logger("wpRequest");

    // Not always we have to add the client-id header
    var sendPostWithHeaders = function(path, params, headers, callback) {
      var clientId = localStorageService.getClientId();

      wpLogger.audit("sendPost", "send POST request to: " + path + " with params: " + JSON.stringify(params));

      $http({
        method: 'POST',
        url: paths.SERVER_URL + paths.ROOT + path,
        headers: headers,
        data: params
      }).then(function successCallback(response) {
        success(response, callback);
      }, function errorCallback(response) {
        failure(response, callback);
      });
    };

    var sendPostWithoutClientId = function(path, params, callback) {
      sendPostWithHeaders(path, params, null, callback)
    };

    var sendPost = function(path, params, callback) {
      sendPostWithHeaders(path, params, {
        'client-id': clientId
      }, callback);
    };

    var sendGet = function(path, callback) {
      var clientId = localStorageService.getClientId();

      wpLogger.audit("sendGet", "send GET request to: " + path);
      $http({
        method: 'GET',
        url: paths.SERVER_URL + paths.ROOT + path,
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId
        }
      }).then(function successCallback(response) {
        success(response, callback);
      }, function errorCallback(response) {
        failure(response, callback);
      });
    };

    var sendGetWithHeaders = function(path, headers, callback) {
      var clientId = localStorageService.getClientId();

      wpLogger.audit("sendGet", "send GET request to: " + path);
      $http({
        method: 'GET',
        url: paths.SERVER_URL + paths.ROOT + path,
        headers
      }).then(function successCallback(response) {
        success(response, callback);
      }, function errorCallback(response) {
        failure(response, callback);
      });
    };

    var sendPut = function(path, pathParams, params, callback) {
      var clientId = localStorageService.getClientId();

      wpLogger.audit("sendPut", "send PUT request to: " + path);
      $http({
        method: 'PUT',
        url: paths.SERVER_URL + paths.ROOT + path + pathParams,
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId
        },
        data: params
      }).then(function successCallback(response) {
        success(response, callback);
      }, function errorCallback(response) {
        failure(response, callback);
      });
    };

    var sendDelete = function(path, params, callback) {
      var clientId = localStorageService.getClientId();

      wpLogger.audit("sendDelete", "send DELETE request to: " + path);
      $http({
        method: 'DELETE',
        url: paths.SERVER_URL + paths.ROOT + path,
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId
        },
        data: params
      }).then(function successCallback(response) {
        success(response, callback);
      }, function errorCallback(response) {
        failure(response, callback);
      });
    };



    function success(response, callback) {
      if (!response.data || !response.data.responseText) {
        wpLogger.error("wpRequest", "Invalid response data");
        callback(null, "Invalid response data");
      } else {
        responseText = response.data.responseText;
        wpLogger.audit('wpRequest succeeded with responseText: ', JSON.stringify(responseText));

        callback(responseText);
      }
    }

    function failure(err, callback) {
      wpLogger.error('failure', JSON.stringify(err));
      callback(null, err);
    }


    return {
      sendPost: sendPost,
      sendPostWithoutClientId: sendPostWithoutClientId,
      sendGet: sendGet,
      sendPut: sendPut,
      sendDelete: sendDelete,
      sendPostWithHeaders: sendPostWithHeaders,
      sendGetWithHeaders: sendGetWithHeaders
    };
  });
