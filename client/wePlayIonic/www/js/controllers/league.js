angular.module('app.controllers')

.controller('leagueCtrl',['$scope', '$state','leagueService', function($scope, $state, leagueService) {

        $scope.clientId = '565992553af4816012cfc742';
        $scope.params = {};

        $scope.goToCreateLeagueView = function(){
            $state.go('tabsController.createLeague');
        }
        $scope.createLeague = function(){
            console.log($scope.params);
            leagueService.createLeague($scope.clientId, $scope.params )

        }
}])
