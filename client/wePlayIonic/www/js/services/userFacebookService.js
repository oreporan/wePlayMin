angular.module('app.services')
  .service('userFacebookService', function($q, $state, logger, userService, localStorageService, $ionicLoading, authenticateService, logger, constants) {

    wpLogger = logger.logger("userFacebookService");

    var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function() {
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    //This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      wpLogger.audit("fbLoginSuccess", "succeeded to login with facebook");
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }
      var authResponse = response.authResponse;

      // Login to WP with facebook token
      authenticateService.wpFacebookSignUp(authResponse.accessToken, function(response, err) {
        if (err) {
          wpLogger.error("fbLoginSuccess", JSON.stringify(err));
          $ionicLoading.hide();
          return;
        } else {
          $ionicLoading.hide();
          getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                //for the purpose of this example I will store user data on local storage
                setUser({
                  authResponse: authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + authResponse.userID
                });

                $ionicLoading.hide();

              },
              function(fail) {
                //fail get profile info
                wpLogger.error("getFacebookProfileInfo", 'profile info fail: ' + fail);
                return;
              });
          $state.go('tabsController.home');
        }
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

    var facebookLogout = function(callback) {
      facebookConnectPlugin.logout(function(success) {
        wpLogger.audit('facebookLogout', "logout success");
        callback(success);
      }, function(error) {
        wpLogger.error('facebookLogout', "logout failed");
        callback(error);
      });
    };

    //This method is executed when the user press the "Login with facebook" button
    var facebookSignIn = function(callback) {
      facebookConnectPlugin.getLoginStatus(function(success) {

        if (success.status === 'connected') {
          // the user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          wpLogger.audit('facebookConnectPlugin.getLoginStatus', "already connected to facebook");

          //check if we have our user saved
          var user = getUser('facebook');
          wpLogger.audit("userFacebookService", "Facebook user: " + JSON.stringify(user));
          if (!user.userID) {

            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {

                //for the purpose of this example I will store user data on local storage
                setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                facebookConnectPlugin.getAccessToken(function(token) {
                  authenticateService.wpFacebookSignUp(token, function(clientId, error) {
                    if (error != null) {
                      callback(null, error);
                    } else {
                      callback(clientId);
                    }
                  });
                }, function(error) {
                  wpLogger.audit('Facebook.getAccessToken failed', error);
                  callback(null, error);
                });


              }, function(fail) {
                //fail get profile info
                wpLogger.audit('profile info fail', fail);
                callback(null, fail);
              });
          } else {

            authenticateService.wpFacebookSignUp(user.accessToken, function(response, err) {
              if (!err) {
                callback(response);
              } else {
                callback(null, err);
              }
            });
          }

        } else {
          //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
          //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          wpLogger.audit('getLoginStatus', "Login to facebook");
          $ionicLoading.show({
            template: 'Logging in...'
          });

          //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };

    return {
      facebookLogout: facebookLogout,
      facebookSignIn: facebookSignIn
    };
  });
