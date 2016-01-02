angular.module('app.controllers')
.controller('leagueCtrl',
  function($scope, $state, $timeout, localStorageService, constants, userService, leagueService, gameService, logger) {
    var wpLogger = logger.logger("leagueCtrl");
    $scope.clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

    $scope.userUpdate = function() {
      userService.updateAppUser($scope.clientId, function(response) {
        $scope.user = response;
        $scope.getLeaguesDetails();
      }, function(error) {
        alert(error);
      });
    }
    if (!$scope.user) {
      $scope.userUpdate();
    }

    $scope.userLeagues = [];
    $scope.userGames = [];
    $scope.selectedLeague = null;
    $scope.selectedGame = null;

    $scope.getLeaguesDetails = function() {
      var leagueObject;
      if ($scope.user) {
        $scope.user.leagues.forEach(function(elem, index, array) {
          leagueService.getLeagueById(array[index], function(response, error) {
            if (error) {
              logger
            } else {
              leagueObject = response;
              $scope.userLeagues.push(leagueObject.data.responseText);  
            }
          });
        })
      }
    }
    $scope.createLeague = function() {
      leagueService.createLeague($scope.params.name, $scope.params.admin, $scope.params.frequency, $scope.params.numOfPlayersPerTeam, $scope.params.makeTeamsAtNum, function(rsponse, error) {
        if (error) {
          wpLogger.audit('createLeague', error);
        } else {
          wpLogger.audit(createLeague, 'League added successfully');
          $scope.userUpdate();
          $state.go('tabsController.league');
          window.location.reload();
        }
      })
    }

    $scope.selectThisLeague = function() {
      $scope.selectedLeague = this.league;
      wpLogger.audit('selectThisLeague', 'selected League :' + $scope.selectedLeague);
    }

    //Games Data
    $scope.getGamesDetails = function() {
      var gameObject;
      console.log($scope.selectedLeague);
      $scope.selectedLeague.games.forEach(function(elem, index, array) {
        gameService.getGameById($scope.clientId, $scope.selectedLeague.id, array[index], function(response) {
          gameObject = response;
          $scope.userGames.push(gameObject);
        })
      })
    }
    $scope.createGame = function() {
      gameService.createGame($scope.clientId, $scope.selectedLeague.id, function() {
        alert('A new game has been successfully created');
        $scope.userUpdate();
        $state.go('tabsController.leagueDetails');
      }, function(error) {

      })
    }









  });
