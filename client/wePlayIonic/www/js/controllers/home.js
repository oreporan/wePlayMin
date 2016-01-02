angular.module('app.controllers')
  .controller('homeCtrl', function($scope, $state, logger, authenticateService, localStorageService, userService, constants, userFacebookService) {

    var wpLogger = logger.logger("homeCtrl");
    var clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);
    wpLogger.audit("clientId: ", clientId);

    var user = userService.getUserById(clientId, function(response, err) {
      if (err) {
        wpLogger.audit("", "failed to get user");
        $scope.userName = "Error: failed to get user";
      } else {
        wpLogger.audit("", "user: " + JSON.stringify(response));
        $scope.userName = response.name;
        $scope.userDetails = response;
        $scope.userLeagues = response.leagues;
        $scope.userGames = response.games;
        if (userFacebookService.getUser) {
          $scope.userImg = "http://graph.facebook.com/" + userFacebookService.getUser.userID + "/picture?type=large";
        }
      }
    });



    $scope.logout = function() {
      authenticateService.logout(function(error){
        if (error) {
          wpLogger.error("logout", "failed to logout");
        } else {
          wpLogger.audit("logout", "succeeded to logout");
          $state.go('login');
        }
      });
    }


  })
