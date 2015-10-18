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

function listAttendingPlayers(gameUsersList, attendingStatus) {
  var usersAttending = [];
  for (var i = 0; i < gameUsersList.length ; i++) {
    if(gameUsersList[i].attending == attendingStatus) {
      usersAttending.push(gameUsersList[i]._id);
    }
  }
  return usersAttending;
}

module.exports.buildGame = function(gameObj) {
  logger.audit('buildGame', 'building game : ' + gameObj._id + ' with ' + sumAttendingPlayers(gameObj.users) + ' available players');
  var players = listAttendingPlayers(gameObj.users, Constants.GAME_ATTENDING_YES.status);
  var maxNumOfPlayersPerTeam = gameObj.numOfPlayersPerTeam;
  var teamA = [];
  var teamB = [];
  var invites = [];
  // Make teams with the home-players
  makeTeams(teamA, teamB, invites, players, maxNumOfPlayersPerTeam);

  // We check if there is room for the leagueInviters. TODO we SHOULD select them by date of attending TODO
  var leagueInvitesList = listAttendingPlayers(gameObj.users, Constants.GAME_ATTENDING_INVITE.status);
  if(teamA.length < maxNumOfPlayersPerTeam && leagueInvitesList.length > 0) {
    // Make teams with the league-invite players
    makeTeams(teamA, teamB, invites, leagueInvitesList, maxNumOfPlayersPerTeam);
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
