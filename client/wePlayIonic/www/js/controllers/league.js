angular.module('app.controllers')

.controller('leagueCtrl',
    function($scope, $state, $timeout, localStorageService, constants, userService, leagueService, gameService) {

        $scope.clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

        $scope.userUpdate = function(){
            userService.updateAppUser($scope.clientId, function(response){
                $scope.user = response;
                $scope.getLeaguesDetails();
            }, function(error){
                alert(error);
            });
        }
        if(!$scope.user){
            $scope.userUpdate();
        }

        $scope.userLeagues = [];
        $scope.userGames = [];
        $scope.selectedLeague = null;
        $scope.selectedGame = null;

        $scope.getLeaguesDetails = function(){
            var leagueObject;
            if($scope.user){
                $scope.user.leagues.forEach(function(elem, index, array){
                    leagueService.getLeagueById($scope.clientId, array[index], function(response){
                        leagueObject = response;
                        $scope.userLeagues.push(leagueObject.data.responseText);
                    });
                })
            }
        }
        $scope.createLeague = function(){
            leagueService.createLeague($scope.clientId, $scope.params, function(){
                alert('League added successfully');
                $scope.userUpdate();
                $state.go('tabsController.league');
                window.location.reload();
            }, function(error){
                alert(error);
            })
        }

        $scope.selectThisLeague = function(){
            $scope.selectedLeague = this.league;
            console.log('selected League :' + $scope.selectedLeague);
        }

        //Games Data
        $scope.getGamesDetails = function(){
            var gameObject;
            console.log($scope.selectedLeague);
            $scope.selectedLeague.games.forEach(function(elem, index, array){
                gameService.getGameById($scope.clientId, $scope.selectedLeague.id, array[index], function(response){
                    gameObject = response;
                    $scope.userGames.push(gameObject);
                })
            })
        }
        $scope.createGame = function(){
            gameService.createGame($scope.clientId, $scope.selectedLeague.id, function(){
                alert('A new game has been successfully created');
                $scope.userUpdate();
                $state.go('tabsController.leagueDetails');
            }, function(error){

            })
        }















});
