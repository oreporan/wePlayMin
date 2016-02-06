angular.module('app.controllers')
  .controller('profileCtrl', function($scope, $state, logger, authenticateService) {

    var wpLogger = logger.logger('profileCtrl');

    $scope.logout = function() {
      authenticateService.logout(function(error) {
        if (error) {
          wpLogger.error("logout", "failed to logout");
        } else {
          wpLogger.audit("logout", "succeeded to logout");
          $state.go('login');
        }
      });
    }
  })
