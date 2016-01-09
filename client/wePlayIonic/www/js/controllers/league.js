angular.module('app.controllers')
  .controller('leagueCtrl',
    function($scope, $state, $timeout, localStorageService, constants, userService, leagueService, gameService, logger) {
      var wpLogger = logger.logger("leagueCtrl");
      $scope.clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

      $scope.user = {
        me: null,
        leagues: [],
        games: [],
      }
      $scope.selected = {
        league: null,
        game: null
      }
      $scope.input = {
        leagueToFind: ''
      }
      $scope.params = {};
      $scope.noResultsFound = false;

      $scope.userUpdate = function() {
        userService.updateAppUser($scope.clientId, function(response) {
          $scope.user.me = response;
          $scope.getLeaguesDetails();
        }, function(error) {
          alert(error);
        });
      }
      $scope.getLeaguesDetails = function() {
        if ($scope.user.me) {
          $scope.user.me.leagues.forEach(function(elem, index, array) {
            leagueService.getLeagueById(array[index], function(response, error) {
              if (error) {
                logger
              } else {
                $scope.user.leagues.push(response);
              }
            });
          })
        }
      }

      if (!$scope.user.me) {
        $scope.userUpdate();
      }
      if(!$scope.selected.league){
        $scope.selected.league = leagueService.getSelectedLeague();
      }

      $scope.createLeague = function() {
        leagueService.addLeague
        ($scope.params.name, $scope.params.admin, $scope.params.frequency, $scope.params.numOfPlayersPerTeam, $scope.params.makeTeamsAtNum,
          function(response, error) {
          if (error) {
            wpLogger.audit('createLeague', error);
          } else {
            wpLogger.audit('createLeague', 'League added successfully');
            $scope.userUpdate();
            $state.go('tabsController.league');
            window.location.reload();
          }
        })
      }

      $scope.selectThisLeague = function() {
        leagueService.setSelectedLeague(this.league);
        wpLogger.audit('selectThisLeague', 'selected League :' + $scope.selected.league);
      }

      //Games Data
      $scope.getGamesDetails = function() {
        var gameObject;
        $scope.selected.league.games.forEach(function(elem, index, array) {
          gameService.getGameById(array[index], function(response, error) {
            if (error) {

            } else {
              gameObject = response;
              $scope.user.games.push(gameObject);
            }
          })
        })
      }
      $scope.createGame = function() {
        gameService.createGame($scope.selected.league.id, function(response, error) {
          if (error) {

          } else {
            alert('A new game has been successfully created');
            $scope.userUpdate();
            $state.go('tabsController.leagueDetails');
          }
        })
      }
      $scope.findLeague = function(){
        $scope.leaguesFound = null;
        $scope.noResultsFound = false;
        leagueService.getLeagueByKeyword($scope.input.leagueToFind, function(response, error){
          if (error){
            $scope.noResultsFound = true;
          } else {
            $scope.leaguesFound = response.leagues;
            if(!$scope.leaguesFound.length){

            }
          }
        })
      }
      $scope.joinLeague = function(){
        leagueService.addUserToLeague(this.league._id, function(response, error){
          if(error){

          }else{
            alert("You have successfully joined " + response.name );
            $scope.userUpdate();
            $state.go('tabsController.league')
            window.location.reload();
          }
        } );
      }
    });
