angular.module('app.controllers')
  .controller('homeCtrl', function($scope, logger, localStorageService, userService, constants, userFacebookService) {

    var wpLogger = logger.logger("homeCtrl");
    var clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);
    wpLogger.audit("clientId: ", clientId);

    var user = userService.getWpUser(clientId, function(response, err) {
      if (err) {
        wpLogger.audit("", "failed to get user");
        $scope.userName = "Error: failed to get user";
      } else {
        wpLogger.audit("", "user: " + JSON.stringify(response));
        $scope.userName = response.name;
        $scope.userDetails = response;
        $scope.userImg = "http://graph.facebook.com/" + userFacebookService.getUser.userID + "/picture?type=large";
      }
    });
    
  })
