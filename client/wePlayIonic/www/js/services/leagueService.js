angular.module('app.services')
    .service('leagueService',['$http', '$state', function($http) {

        return {
            getLeagueById: function(clientId, leagueId, success, fail) {
                var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/wePlay/v1/leagues/getLeague/' + leagueId,
                    headers: {
                        'Content-Type': 'application/json',
                        'client-id': clientId
                    }
                }
                return $http(req).then(success, fail);
            },
            createLeague: function(clientId, params, success, fail){
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
                return $http(req).then(success, fail);
            }
        }
    }]);
