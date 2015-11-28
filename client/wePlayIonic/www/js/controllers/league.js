angular.module('app.controllers')

.controller('leagueCtrl',['$scope','constants', function($scope, constants) {
    alert(constants.myApp);
}])
