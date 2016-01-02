angular.module('app.constants')

.constant('paths', {

  // Server root url
  SERVER_URL: "http://10.0.0.2:3000",

  // Application Root - all requests are prefixed with this path
  ROOT: '/wePlay/v1',

  //---------------Authenticate endpoint----------------//

  /*
   * Authenticate endpoint
   * Authenticates users, signup, signin
   * This is the only endpoint that doesn't pass through the validation filter
   * http://wwww.HOST.com/wePlay/v1/authenticate/*
   */
  BASE_AUTHENTICATE: '/auth',

  /*
   * info: signs up a user
   * method: POST
   * accepts: JSON - object compliant with the User model - {name: <name>, email: <email> , password: <password>}
   * returns: JSON - a user object holding a new clientId
   * example: http://wwww.HOST.com/wePlay/v1/authenticate/signup/
   */
  PATH_AUTHENTICATE_SIGNUP: '/signup/',

  /*
   * info: signs in an existing user
   * method: POST
   * accepts: JSON - {email: <email>, password: <password}
   * returns: JSON - a user object
   * example: http://wwww.HOST.com/wePlay/v1/authenticate/signin/
   */
  PATH_AUTHENTICATE_SIGNIN: '/signin/',

  /*
   * info: facebook authentication
   * method: POST
   * accepts: JSON - {email: <email>, password: <password}
   * returns: JSON - a user object
   * example: http://wwww.HOST.com/wePlay/v1/authenticate/signin/
   */
  PATH_AUTHENTICATE_FACEBOOK: '/facebook/',

  /*
   * info: returns a user object holding the password, this is currently
   * under construction because we will in reality send an email not return the object
   * method: GET
   * accepts: String - email
   * returns: JSON - a user object with the email
   * example: http://wwww.HOST.com/wePlay/v1/authenticate/forgotpassword/oreporan@gmail.com
   */
  PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL: '/forgotpassword',

  //---------------User endpoint----------------//

  /*
   * Users endpoint
   * All user related requests
   * http://wwww.HOST.com/wePlay/v1/users/*
   */
  BASE_USERS: '/users',

  /*
   * info: gets a user by id
   * method: GET
   * accepts: String - clientId
   * returns: JSON - a user object
   * example: http://wwww.HOST.com/wePlay/v1/users/getUser/43524261
   */
  PATH_USERS_GETUSER_WITH_ID: '/getUser',

  /*
   * info: gets a user by his user name (not email!)
   * method: GET
   * accepts: String - userName
   * returns: JSON - a user object
   * example: http://wwww.HOST.com/wePlay/v1/users/getUser/Moshiko
   */
  PATH_USERS_GETUSER_WITH_NAME: '/getUserByName',

  /*
   * info: updates a user's parameters
   * method: PUT
   * accepts: JSON - an object that holds parameters from the user object with updated values
   * returns: JSON - a user object with the new values
   * example: http://wwww.HOST.com/wePlay/v1/users/updateUser/
   */
  PATH_USERS_UPDATEUSER_WITH_ID: '/updateUser',

  /*
   * info: gets a list of user objects
   * method: POST
   * accepts: JSON - an array of clientIds {users: ["1234", "5436"...]}
   * returns: array - an array of JSONs - user objects
   * example: http://wwww.HOST.com/wePlay/v1/users/getUsersListById/
   */
  PATH_USERS_GETUSERSLIST_BY_ID: '/getUsersListById',

  //---------------League endpoint----------------//

  /*
   * League endpoint
   * All league related requests
   * http://wwww.HOST.com/wePlay/v1/leagues/*
   */
  BASE_LEAGUES: '/leagues',

  /*
   * info: creates a new league and makes this user the admin
   * method: POST
   * accepts: JSON - object compliant with the League model - { name: <String - league name>, admin: <String - this client id>, frequency: <Int - for now, type -1>, numOfPlayersPerTeam: <Int> , makeTeamsAtNum: <Int>}
   * returns: array - an array of JSONs - user objects
   * example: http://wwww.HOST.com/wePlay/v1/users/addLeague/
   */
  PATH_LEAGUES_ADDLEAGUE: '/addLeague',

  /*
   * info: gets the league object by league Id
   * method: GET
   * accepts: String - leagueId
   * returns: JSON - a league object
   * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
   */
  PATH_LEAGUES_GETLEAGUEBYID: '/getLeague',

  /*
   * info: gets the league object by league Id
   * method: GET
   * accepts: String - leagueId
   * returns: JSON - a league object
   * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
   */
  PATH_LEAGUES_GETLEAGUEBYNAME: '/getLeagueByName',


  /*
   * info: gets all the leagues objects that contain this word, for example
   * calling this method with the keyword : 'over' will find the league 'over' , 'overflow' but not the league 'stack overflow'
   * method: GET
   * accepts: String - league name keyword
   * returns: JSON - an array of league objects {leagues : [{},{}]}
   * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
   */
  PATH_LEAGUES_GETLEAGUESBYKEYWORD: '/getLeagueByKeyword',


  /*
   * info: pushes this user to a league, the client is taken from the header
   * method: GET
   * accepts: String - leagueId
   * returns: JSON - a league object
   * example: http://wwww.HOST.com/wePlay/v1/users/addUserToLeague/4524262
   */
  PATH_LEAGUES_ADDUSERTOLEAGUE: '/addUserToLeague',

  /*
   * info: removes this user from a league, the client is taken from the header
   * method: GET
   * accepts: String - leagueId
   * returns: JSON - a league object without the user in it
   * example: http://wwww.HOST.com/wePlay/v1/users/removeUserFromLeague/4524262
   */
  PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID: '/removeUserFromLeague',

  /*
   * info: gets a list of league objects
   * method: POST
   * accepts: JSON - an array of leagueIds  {leagues: ["1234", "5436"...]}
   * returns: array - an array of JSONs - league objects
   * example: http://wwww.HOST.com/wePlay/v1/users/getLeaguesListById/
   */
  PATH_LEAGUES_GETLEAGUESLIST_BY_ID: '/getLeaguesListById',

  /*
   * info: updates league parameters such as name or frequency
   * method: PUT
   * accepts: JSON - {admin : <clientId>}
   * returns: JSON - league object updated
   * example: http://wwww.HOST.com/wePlay/v1/users/updateLeague/
   */
  PATH_LEAGUES_UPDATELEAGUE: '/updateLeague',

  /*
   * info: updates league parameters such as name or frequency
   * method: PUT
   * accepts: JSON - an array of leagueIds  { name: <new name>, frequency : <new frequency>}
   * returns: JSON - league object with new parameters
   * example: http://wwww.HOST.com/wePlay/v1/users/updateLeague/
   */
  PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID: '/addAdmin',

  // Game endpoint
  BASE_GAME: '/games',
  PATH_GAME_ADDGAME: '/addGame',
  PATH_GAME_UPDATEGAME: '/updateGame',
  PATH_GAME_CHANGEGAMESTATUS_WITH_ID: '/gameStatus',
  PATH_GAME_GETGAME_WITH_ID: '/getGame',
  PATH_GAME_GETGAMELIST: '/getGamesListById',
  PATH_GAME_BUILDGAME_WITH_ID: '/buildGame',
  PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID: '/attending'

});
