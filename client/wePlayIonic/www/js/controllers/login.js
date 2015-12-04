angular.module('app.controllers')
  .controller('loginCtrl', function($scope, $state, $q, userService, userFacebookService, localStorageService, $ionicLoading, authenticateService, logger) {
    var wpLogger = logger.logger("loginCtrl");


    // For testing: clear clientId before starting
    localStorageService.removeItem("wp_clientId");

    // wp app start here.
    // Check if clientId exist, go to home page if true, else - Login page
    var clientId = localStorageService.getByKey("wp_clientId");
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

    //This is the success callback from the login method
    var fbLoginSuccess = function(response) {

      wpLogger.audit("fbLoginSuccess", "success function");

      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }


      var authResponse = response.authResponse;
      authenticateService.wpFacebookSignUp(authResponse.accessToken, function(response, err) {

        if (err) {
          wpLogger.error("fbLoginSuccess", JSON.stringify(err));
        } else {
          $state.go('tabsController.home');
        }
      });

      $ionicLoading.hide();

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
            //for the purpose of this example I will store user data on local storage
            userFacebookService.setUser({
              authResponse: authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
            });

            $ionicLoading.hide();

          },
          function(fail) {
            //fail get profile info
            wpLogger.error("getFacebookProfileInfo", 'profile info fail: ' + fail);
          });
    };


    //This is the fail callback from the login method
    var fbLoginError = function(error) {
      wpLogger.error('fbLoginError', error);
      $ionicLoading.hide();
    };

    //this method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function(authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function(response) {
          wpLogger.audit('getFacebookProfileInfo', JSON.stringify(response));
          info.resolve(response);
        },
        function(response) {
          wpLogger.error('getFacebookProfileInfo', response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    facebookLogout = function() {

      facebookConnectPlugin.logout(function(success) {
        wpLogger.audit('facebookLogout', "logout success");
      }, function(error) {
        wpLogger.error('facebookLogout', "logout failed");
      });
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookLogout();
      facebookConnectPlugin.getLoginStatus(function(success) {

        if (success.status === 'connected') {
          // the user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          wpLogger.audit('facebookConnectPlugin.getLoginStatus', "already connected to facebook");

          //check if we have our user saved
          var user = userFacebookService.getUser('facebook');
          wpLogger.audit("userFacebookService", "Facebook user: " + JSON.stringify(user));
          if (!user.userID) {

            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {

                //for the purpose of this example I will store user data on local storage
                userFacebookService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                facebookConnectPlugin.getAccessToken(function(token) {
                  authenticateService.wpFacebookSignUp(token, function(clientId, error) {
                    if (error != null) {
                      $state.go('tabsController.home');
                    } else {
                      console.log('wp facebook-login failed', error);
                    }
                  });
                }, function(error) {
                  console.log('Facebook.getAccessToken failed', error);
                });


              }, function(fail) {
                //fail get profile info
                console.log('profile info fail', fail);
              });
          } else {

            authenticateService.wpFacebookSignUp(user.accessToken, function(response, err){
              if (!err) {
                $state.go('tabsController.home');
              }
            });
          }

        } else {
          //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
          //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          wpLogger.audit('getLoginStatus', success.status);
          $ionicLoading.show({
            template: 'Logging in...'
          });

          //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };
  })
