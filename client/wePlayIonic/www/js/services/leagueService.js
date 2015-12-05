angular.module('app.services')
    .service('leagueService',['$http', function($http) {

        return {
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
                }
                $http(req).then(function successCallback(response){

                }, function errorCallback(error){

                })
            }
        }
    }]);