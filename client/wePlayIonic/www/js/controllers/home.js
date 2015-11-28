angular.module('app.controllers')
  .controller('homeCtrl', ['$scope', function($scope) {
    // alert(constants.myApp);
    var user = window.localStorage.wp_user;
    console.info("homeCtrl, user: " + JSON.stringify(user));
    $scope.userName = user.name;

    $scope.userDetails = user;


    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookLogout = function() {

      facebookConnectPlugin.logout(function(success) {
        console.log("logout success");
      }, function(error) {
        console.log("logout failed");
      });
    };
  }])
