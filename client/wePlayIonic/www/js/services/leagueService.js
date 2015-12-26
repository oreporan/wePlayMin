angular.module('app.services')
    .service('leagueService',['$http', '$state', function($http, $state) {

        return {
            getMyLeagues: function(clientId){
                /* TODO */
            },
            createLeague: function(clientId, params){
                var req = {
                    method: 'POST',
                    url: 'http://localhost:3000/wePlay/v1/leagues/addLeague/',
                    headers: {
                        'Content-Type': 'application/json',
                        'client-id': clientId
                    },
                    data: {
                        name: params.name,
                        numOfPlayersPerTeam: params.numOfPlayersPerTeam,
                        admin: clientId,
                        frequency: params.frequency,
                        makeTeamsAtNum: params.makeTeamsAtNum
                    }
                };
                $http(req).then(function successCallback(response){
                    alert('League added successfully');
                    $state.go('tabsController.league');
                }, function errorCallback(error){
                    alert(error);
                })
            }
        }
    }]);
