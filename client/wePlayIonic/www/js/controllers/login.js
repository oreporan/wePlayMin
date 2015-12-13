angular.module('app.controllers')
  .controller('loginCtrl', function($scope, $state, $q, userService, userFacebookService, localStorageService, $ionicLoading, authenticateService, logger, constants) {
      var wpLogger = logger.logger("loginCtrl");

      // For testing: clear clientId before starting
      // localStorageService.removeItem("wp_clientId");

      // WP app start here.
      // Check if clientId exist, go to home page if true, else - Login page
      var clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

      $scope.isSignUp = false;
      $scope.formData = {};

      function main() {
        if (clientId) {
          wpLogger.audit("clientId exists");
          var user = userService.getWpUser(clientId, function(response, err) {
            if (err) {
              wpLogger.audit("couldn't get wpUser. err" + err);

            } else {
              $state.go('tabsController.home');
            }
          });
        }
      }
      main();


      $scope.facebookSignIn = function() {
        userFacebookService.facebookSignIn(function(response, error) {
          if (error) {
            $ionicLoading.hide();
          } else {
            $state.go('tabsController.home');
          }
        })
      }

      $scope.wpSignIn = function() {
        authenticateService.signIn($scope.email, $scope.password, function(response, error) {
          if (error) {
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
            $state.go('tabsController.home');
          }
        })
      }

      $scope.wpSignUp = function() {
        console.log('username:' + $scope.username);
        authenticateService.signUp($scope.formData.username, $scope.formData.email, $scope.formData.password, function(response, error) {
          if (error) {
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
            $state.go('tabsController.home');
          }
        })
      }

      $scope.showSignUp = function() {
        if ($scope.formData) {
          console.log(JSON.stringify($scope.formData));
        }
          $scope.isSignUp = true;
        }

        $scope.hideSignUp = function() {
          $scope.isSignUp = false;
        }
      })
