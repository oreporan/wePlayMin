angular.module('app.controllers')
  .controller('homeCtrl', function($scope, logger, localStorageService, userService) {

    var wpLogger = logger.logger("homeCtrl");
    var clientId = localStorageService.getByKey("wp_clientId");

    var user = userService.getWpUser(clientId, function(response, err) {
      if (err) {
        wpLogger.audit("", "failed to get user");
        $scope.userName = "Error: failed to get user";
      } else {
        wpLogger.audit("", "user: " + JSON.stringify(response));
        $scope.userName = response.name;
        $scope.userDetails = response;
      }
    });



    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookLogout = function() {

      facebookConnectPlugin.logout(function(success) {
        console.log("logout success");
      }, function(error) {
        console.log("logout failed");
      });
    };
  })
