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
        wpLogger.audit("main", "clientId exists");
        var user = userService.getUserById(clientId, function(response, err) {
          if (err) {
            wpLogger.audit("couldn't get wpUser. err" + err);

          } else {
            $state.go('tabsController.home', {}, {
              reload: true
            });
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
          $state.go('tabsController.home', {}, {
            reload: true
          });
        }
      })
    }

    $scope.wpSignIn = function() {
      authenticateService.signIn($scope.formData.email, $scope.formData.password, function(response, error) {
        if (error) {
          $ionicLoading.hide();
        } else {
          $ionicLoading.hide();
          $state.go('tabsController.home', {}, {
            reload: true
          });
        }
      })
    }

    $scope.wpSignUp = function() {
      authenticateService.signUp($scope.formData.username, $scope.formData.email, $scope.formData.password, function(response, error) {
        if (error) {
          $ionicLoading.hide();
        } else {
          $ionicLoading.hide();
          $state.go('tabsController.home', {}, {
            reload: true
          });
        }
      })
    }

    $scope.showSignUp = function() {
      $scope.isSignUp = true;
    }

    $scope.hideSignUp = function() {
      $scope.isSignUp = false;
    }
  })
  .directive('compareTo', function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  })
