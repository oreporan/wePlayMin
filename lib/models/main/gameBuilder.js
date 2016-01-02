// This file builds games...
var logger = require('../../utils/logger').init('gameBuilder');
var Constants = require('../../utils/Constants.js');

var sumAttendingPlayers = module.exports.sumAttendingPlayers = function(listOfUsers) {
  var count = 0;
  for (var i = 0; i < listOfUsers.length ; i++) {
    if(listOfUsers[i].attending == 1) {
      count++;
    }
  }
  return count;
}

function listAttendingPlayers(gameUsersList, isInvite) {
  var usersAttending = [];
  for (var i = 0; i < gameUsersList.length ; i++) {
    if(gameUsersList[i].attending == Constants.GAME_ATTENDING_YES.status && gameUsersList[i].isInvite == isInvite) {
      usersAttending.push(gameUsersList[i]._id);
    }
  }
  return usersAttending;
}

module.exports.buildGame = function(gameObj) {
  logger.audit('buildGame', 'building game : ' + gameObj._id + ' with ' + sumAttendingPlayers(gameObj.users) + ' available players');
  var players = listAttendingPlayers(gameObj.users, false);
  var maxNumOfPlayersPerTeam = gameObj.numOfPlayersPerTeam;
  var teamA = [];
  var teamB = [];
  var invites = [];
  // Make teams with the home-players
  makeTeams(teamA, teamB, invites, players, maxNumOfPlayersPerTeam);

  // We check if there is room for the leagueInviters. TODO we SHOULD select them by date of attending TODO
  var leagueInvitesList = listAttendingPlayers(gameObj.users, true);
  if(teamA.length < maxNumOfPlayersPerTeam && leagueInvitesList.length > 1) {
    // Make teams with the league-invite players
    for(var i = 0 ; i < leagueInvitesList.length ; i = i + 2) {
      if(teamA.length < maxNumOfPlayersPerTeam && leagueInvitesList[i + 1] != null) {
        teamB.push(leagueInvitesList[i]);
        teamA.push(leagueInvitesList[i + 1]);
      }
    }
  }

  // set the new teams
  gameObj.teamA = teamA;
  gameObj.teamB = teamB;
  gameObj.invites = invites;
  return gameObj;
}

function makeTeams(teamA, teamB, invites, playersList, maxNumOfPlayersPerTeam) {
  for(var i = 0 ; i < playersList.length ; i++) {
    if(teamA.length == maxNumOfPlayersPerTeam || teamA.length >= playersList.length / 2) {
      if(teamB.length == maxNumOfPlayersPerTeam) {
        invites.push(playersList[i]);
      } else {
        teamB.push(playersList[i]);
      }
    } else {
      teamA.push(playersList[i]);
    }
  }
}
