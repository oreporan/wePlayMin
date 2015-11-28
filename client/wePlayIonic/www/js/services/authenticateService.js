angular.module('app.services')
  .service('authenticateService', function($http) {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var wpFacebookSignUp = function(facebookToken, success, failure) {
      console.log("authenticateService wpFacebookSignUp", facebookToken);
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/wePlay/v1/auth/facebook/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          access_token: facebookToken
        }
      }

      $http(req).then(function successCallback(response) {
        return window.localStorage.wp_user = JSON.stringify(user);

      }, function errorCallback(error) {
        return console.log(error);

      });


    };

    var signUp = function(userName, password, email) {
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/wePlay/v1/auth/signup/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          name: userName,
          email: email,
          password: password
        }
      }

      $http(req).then(function successCallback(response) {
        return window.localStorage.wp_user = JSON.stringify(user);

      }, function errorCallback(response) {
        return console.log(error);

      });
    }

    var getUser = function() {
      return JSON.parse(window.localStorage.wp_user || '{}');
    };

    return {
      wpFacebookSignUp: wpFacebookSignUp,
      signUp: signUp,
      getUser: getUser
    };
  });
