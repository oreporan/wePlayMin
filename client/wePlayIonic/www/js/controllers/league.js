angular.module('app.controllers')
  .controller('leagueCtrl',
    function($scope, $state, $timeout, localStorageService, constants, userService, leagueService, gameService, logger) {
      var wpLogger = logger.logger("leagueCtrl");
      $scope.clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);

      $scope.user = null;

      $scope.input = {
        leagueToFind: '',
        userToFind: ''
      };
      $scope.params = {};
      $scope.noResultsFound = false;
      $scope.errorBox = null;
      $scope.imAMemberOfThisLeague = null;

      $scope.getLeaguesDetails = function(leagues) {
        leagueService.getLeaguesListById(leagues, function(response, error){
          if(error){

          } else {
            $scope.leagues = response;
          }
        });
      };

      $scope.getUser = function() {
        userService.getUserById($scope.clientId, function(response, error){
          if (error) {

          } else {
            $scope.user = response;
            $scope.getLeaguesDetails(response.leagues);
          }
        });
      };

      //Init
      if (!$scope.user) {
        $scope.getUser();
      }
      $scope.league = leagueService.getSelectedLeague();


      $scope.updateUser = function() {
        userService.updateAppUser($scope.clientId, function(response) {
          $scope.user = response;
          $scope.getLeaguesDetails();
        }, function(error) {
          alert(error);
        });
      };

      $scope.getLeagueDetailedUser = function(league){
        userService.getUsersListById(league.users, function(response, error){
          if(error){

          } else {
            $scope.league.users = response;
          }
        });
      };

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

      $scope.createLeague = function() {
        $scope.params.frequency = 1;
        leagueService.addLeague
        ($scope.params.name, $scope.params.admin, $scope.params.frequency,
          $scope.params.numOfPlayersPerTeam, $scope.params.makeTeamsAtNum,
          function(response, error) {
          if (error) {

          } else {
              leagueService.setSelectedLeague(response);
              $state.go('tabsController.addUsersToLeague');
            }
        });
      }

      $scope.findLeague = function(){
        $scope.leaguesFound = null;
        $scope.noResultsFound = false;
        leagueService.getLeagueByKeyword($scope.input.leagueToFind, function(response, error){
          if(error){
            $scope.noResultsFound = true;
          } else {
            $scope.leaguesFound = response.leagues;
            if(!$scope.leaguesFound.length){
              $scope.noResultsFound = true;
            }
          }
        });
      };

      $scope.checkMinChars = function(input){
        if(input.length > 2)
          return true;
        return false;
      };

      $scope.findUser = function(){
        userService.findUserByKeyword($scope.input.userToFind, function(response, err) {
          if(err) {
            logger;
          } else {
            if(response.users.length){
              userService.getUsersListById(response.users, function(response, err){
                if(err){
                  logger;
                } else {
                  $scope.usersFound = response;
                  $scope.noResultsFound = false;
                }
              })
            }
            else{
              $scope.noResultsFound = true;
            }
          }
        });
      };

      $scope.joinLeague = function(league){
        leagueService.addUserToLeague(league._id, function(response, error){
          if(error){

          }else{
            alert("You have successfully joined " + response.name );
            $scope.updateUser();
            $state.go('tabsController.leagues');
            location.reload();
          }
        } );
      };

      $scope.addPlayerToLeague = function(user){
        var league = leagueService.getSelectedLeague();
        leagueService.addUserToLeague(league._id, user._id, function(response, error){
          if(error){
            logger;
          } else {
            $scope.usersFound = null;
            $scope.input.userToFind = null;
            alert("You have successfully added " + user.name);
          }
        })
      };

      //Sets
      $scope.selectThisLeague = function(league) {
        leagueService.setSelectedLeague(league);
        return true;
      };

      //views Routing

      $scope.goToLeaguesMain = function() {
        $state.go('tabsController.leagues');
        location.reload();
      };

      $scope.goToSingleLeague = function() {
        $scope.league = leagueService.getSelectedLeague();
        $scope.imAMemberOfThisLeague = $scope.checkIfImAMemberOfThisLeague($scope.league, $scope.user);
        $scope.getLeaguesDetails($scope.selected.league);
        $state.go('tabsController.singleLeague');
      }
    });
