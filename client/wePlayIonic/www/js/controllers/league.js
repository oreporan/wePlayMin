angular.module('app.controllers')
  .controller('leagueCtrl',
    function($scope, $state, $timeout, localStorageService, constants, userService, leagueService, gameService, logger) {
      var wpLogger = logger.logger("leagueCtrl");
      $scope.clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

      $scope.user = {
        me: null,
        leagues: [],
        games: []
      }
      $scope.selected = {
        league: null,
        game: null,
        leagueToViewAsGuest: null
      }
      $scope.input = {
        leagueToFind: ''
      }
      $scope.params = {};
      $scope.noResultsFound = false;
      $scope.imAMemberOfThisLeague = null;

      $scope.getUser = function() {
        userService.getUserById($scope.clientId, function(response, error){
          if (error) {

          } else {
            $scope.user.me = response;
            $scope.getLeaguesDetails();
          }
        })
      }

      $scope.updateUser = function() {
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

      $scope.getLeagueDetailedUser = function(league){
        var detailedUsers = [];
        league.users.forEach(function(elem, index, array){
          userService.getUserById(array[index]._id, function(response, error){
            if (error) {
              logger
            } else {
              detailedUsers.push(response);
            }
          })
        })
        return detailedUsers;
      }

      $scope.checkIfImAMemberOfThisLeague  = function(league, me){
        var res = null;
        league.users.forEach(function(elem, index, array){
          if(array[index]._id == me._id)
            res = true;
        })
        if(res)
          return true;
        return false;
      }

      if (!$scope.user.me) {
        $scope.getUser();
      }
      if($state.current.name === 'tabsController.singleLeague' && !$scope.selected.league){
        $scope.selected.league = leagueService.getSelectedLeague();
        $scope.imAMemberOfThisLeague = $scope.checkIfImAMemberOfThisLeague($scope.selected.league, $scope.user.me);
        /*$scope.selected.leagues.detailedUsers = $scope.getLeagueDetailedUser($scope.selected.leagues);*/
      }

      $scope.createLeague = function() {
        leagueService.addLeague
        ($scope.params.name, $scope.params.admin, $scope.params.frequency, $scope.params.numOfPlayersPerTeam, $scope.params.makeTeamsAtNum,
          function(response, error) {
          if (error) {
            wpLogger.audit('createLeague', error);
          } else {
            wpLogger.audit('createLeague', 'League added successfully');
            $scope.updateUser();
            $state.go('tabsController.leagues');
            window.location.reload();
          }
        })
      }

      $scope.selectThisLeague = function() {
        leagueService.setSelectedLeague(this.league);
        wpLogger.audit('selectThisLeague', 'selected League :' + $scope.selected.league);
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
      $scope.joinLeague = function(league){
        leagueService.addUserToLeague(league._id, function(response, error){
          if(error){

          }else{
            alert("You have successfully joined " + response.name );
            $scope.updateUser();
            $state.go('tabsController.leagues');
            window.location.reload();
          }
        } );
      }
    });
