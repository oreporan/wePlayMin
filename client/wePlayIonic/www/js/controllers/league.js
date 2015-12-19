angular.module('app.controllers')

.controller('leagueCtrl',['$scope', '$state','leagueService', function($scope, $state, leagueService) {

        $scope.clientId = '565992553af4816012cfc742';
        $scope.params = {};

        $scope.goToCreateLeagueView = function(){
            $state.go('tabsController.createLeague');
        }
        $scope.createLeague = function(){
            leagueService.createLeague($scope.clientId, $scope.params)
        }
        $scope.getMyLeagues = function(){
            leagueService.getMyLeagues(clientId);
        }
}]);
