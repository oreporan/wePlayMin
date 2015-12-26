angular.module('app.services')
    .service('gameService',['$http', '$state', function($http) {

        return{
            getGameById: function(clientId, leagueId, gameId, success, fail){
                var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/wePlay/v1/leagues/getGame/' + gameId,
                    headers: {
                        'Content-Type': 'application/json',
                        'client-id': clientId,
                        'league-id': leagueId
                    }
                }
                return $http(req).then(success, fail);
            },
            createGame: function(clientId, leagueId, matchDay, success, fail){
                var req = {
                    method: 'POST',
                    url: 'http://localhost:3000/wePlay/v1/leagues/addGame',
                    headers: {
                        'Content-Type': 'application/json',
                        'client-id': clientId,
                        'league-id': leagueId
                    },
                    data: {
                        'matchDay': matchDay
                    }
                };
                $http(req).then(success, fail);
            }
        }

    }]);
